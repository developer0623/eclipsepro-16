import { Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { combineLatestWith, Subscription, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import {
  IMachine,
  ITask,
  IDashboardMachine,
  IWallboardDevice,
  IAndonSequenceConfig,
  IAndonSequencePanel,
  IAndonView,
} from 'src/app/core/dto';
import { TaskToMagicStateNumberMap } from '../../shared/services/store/warehouse/selector';
import { EditWallboardDialogComponent } from './edit-wallboard-dialog/edit-wallboard-dialog.component';
import { EditPanelDialogComponent } from './edit-panel-dialog/edit-panel-dialog.component';
import { AndonService } from '../../shared/services/andon.service';
import { MachineDataService } from '../../shared/services/machine-data.service';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-wallboard',
  templateUrl: './wallboard.component.html',
  styleUrls: ['./wallboard.component.scss'],
})
export class WallboardComponent implements OnDestroy {
  machineChangeEventEmitter = new Subject<IMachine>();
  serverHost;
  selectedTabIndex = 0;
  mdMedia;
  darkTheme = true;
  andonGridOptions = {
    appendTo: 'body',
    delay: 75,
    distance: 7,
    forceHelperSize: true,
    forcePlaceholderSize: true,
    handle: false,
    helper: (event, el) => {
      return el.clone().addClass('andon-sort-helper');
    },
    placeholder: 'andon-sortable-placeholder',
    tolerance: 'pointer',
    scroll: true,
    cancel: '.unsortable',
    stop: (e, ui) => {
      let index = ui.item.parent().parent().scope().$index;
      this.updatePanelSequence(this.andonSequences[index]);
    },
  };
  timer;
  andonSequences: IAndonSequenceConfig[] = [];
  viewKey = '';
  playKey = '';
  editing;
  machines: IMachine[] = [];
  sequences: IAndonSequenceConfig[] = [];
  wallboardDevices = [];
  andonViews: IAndonView[] = [];
  metricDefinitions = [];
  currentJob;
  currentItem;
  readyTask;
  sequence;
  selectedMachine;
  selectedSequence;
  dashboardMachines: IDashboardMachine[] = [];
  selectedDashboardMachine: IDashboardMachine;
  subscriptions_: Subscription[] = [];
  constructor(
    public media: MediaObserver,
    private route: ActivatedRoute,
    private router: Router,
    public machineData: MachineDataService,
    public clientDataStore: ClientDataStore,
    private andonService: AndonService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {
    this.serverHost = `${location.protocol}://${location.host}`;
    this.selectedTabIndex = Number(this.route.snapshot.paramMap.get('tab')) || 0;
    this.subscriptions_ = [
      this.machineData.dashboardMachines$.subscribe((data) => {
        if (data && data.length > 0 && data[0].stats && data[0].metricSettings)
          this.dashboardMachines = data;
      }),
      clientDataStore
        .SelectMachines()
        .pipe(
          combineLatestWith(
            clientDataStore.SelectWallboardDevices(),
            clientDataStore.SelectAndonSequenceConfig()
          )
        )
        .subscribe(([machines, devices, sequences]) => {
          this.machines = [...machines];
          this.sequences = _.cloneDeep(sequences);
          this.wallboardDevices = devices.map((device) => {
            let newDevice = { ...device, displayDetail: '' };
            if (device.contentType === 'Andon') {
              this.selectedMachine =
                machines.find((m) => m.machineNumber === device.deviceParams.machineNumber) ||
                machines[0];
              this.selectedSequence = sequences.find(
                (q) => q.id === device.deviceParams.andonSequenceId
              ) || { name: '' };

              if (!!this.selectedMachine?.machineNumber) {
                this.machineChangeEventEmitter.next(this.selectedMachine);
                newDevice.displayDetail = `${this.selectedMachine.description}, ${this.selectedSequence.name}`;
              }
            } else if (device.contentType === 'ExternalUrl') {
              newDevice.displayDetail = device.deviceParams.externalUrl;
            } else if (device.contentType === 'Message') {
              newDevice.displayDetail = device.deviceParams.message;
            } else if (device.contentType === 'ProductionSummary') {
              // todo: fill in
            }

            return newDevice;
          });
        }),
      this.machineChangeEventEmitter
        .pipe(
          map((m: IMachine) => {
            this.selectedDashboardMachine = this.dashboardMachines.find(
              (ma) => ma.machineNumber === m.machineNumber
            );
            return m.machineNumber;
          }),
          switchMap((machineNumber) =>
            this.andonService.andonDataForMachineAndSequence(machineNumber)
          )
        )
        .subscribe((data) => {
          this.andonViews = [...data.views];
          this.andonViews.forEach((item) => {
            // Make definitions easy to find by indexing using viewKey.
            this.andonViews[item.viewKey] = item;
          });

          this.metricDefinitions = [...data.metricDefinitions];
          this.metricDefinitions.forEach((def) => {
            // Make definitions easy to find by indexing using metricName.
            this.metricDefinitions[def.metricName] = def;
          });

          this.currentJob = data.currentJob;
          this.currentItem = data.currentItem;
          this.readyTask = {
            ...data.task,
            magicState: TaskToMagicStateNumberMap(data.task as ITask),
          };
        }),
      clientDataStore.SelectAndonSequenceConfig().subscribe((sequences) => {
        // ANDON DATA
        this.andonSequences = _.cloneDeep(sequences);
        console.log('machineData.machines', this.machineData.machines);
        console.log('andonSequences', this.andonSequences);
      }),
    ];
  }

  onChangeTab(index) {
    this.router.navigate([], {
      queryParams: {tab: index},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  showEditModal(device) {
    const newDevice = { ...device };
    const dialogRef = this.dialog.open(EditWallboardDialogComponent, {
      width: '400px',
      data: {
        machines: this.machines,
        sequences: this.sequences,
        device: newDevice,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const { wallboardDeviceKey, contentType, deviceParams, wallboardDeviceName } = result;
        this.andonService.updateWallboardDevice(
          wallboardDeviceKey,
          contentType,
          deviceParams,
          wallboardDeviceName
        );
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  deleteDevice(device) {
    this.andonService.deleteWallboardDevice(device.wallboardDeviceKey, device.documentID);
  }

  machineChange(selectedMachine) {
    this.machineChangeEventEmitter.next(selectedMachine);
  }

  /**
   * Play a sequence
   */

  startSequence(sequence, i) {
    if (!i) {
      i = 0;
    }
    const advanceViewKey = () => {
      if (++i >= sequence.panels.length) {
        i = 0;
      }
      if (!sequence.panels.length) {
        this.initKey();
        return;
      }
      this.setKey(sequence, i);
    };
    this.timer = window.setInterval(advanceViewKey, sequence.panels[i].duration * 1000);
  }

  /**
   * Set the view / play key
   */
  setKey(sequence, index) {
    this.viewKey = sequence.panels[index].viewKey;
    this.playKey = index.toString();
  }

  /**
   * Stop sequence timer / cancel $interval
   */
  stopSequence() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Restart a sequence
   */
  restartSequence(sequence, index) {
    this.stopSequence();
    if (!sequence.panels.length) {
      this.initKey();
      return;
    }
    if (sequence.panels.length >= 1 && !this.editing && sequence.panels[index]) {
      this.setKey(sequence, index);
      this.startSequence(sequence, index);
    }
  }

  /**
   * Initialize view / play key
   */
  initKey() {
    this.stopSequence();
    this.viewKey = '';
    this.playKey = '';
  }

  /**
   * Find current panel
   */
  currentPanel(sequence, panel) {
    let current = false;
    if (panel.viewKey === this.viewKey && panel.playKey === this.playKey) {
      current = true;
    }
    return current;
  }

  /**
   * Edit sequence message
   */
  togglePanelChart(sequence, panel) {
    panel.chart = !panel.chart;
    this.updatePanelSequence(sequence);
  }

  /**
   * Edit sequence message
   */
  editPanelDetail(
    seqIndex: number,
    index: number,
    sequence: IAndonSequenceConfig,
    editKey: string
  ) {
    // ev.stopPropagation();
    this.stopSequence();
    this.setKey(sequence, index);
    this.editing = true;
    const dialogRef = this.dialog.open(EditPanelDialogComponent, {
      width: '400px',
      data: {
        sequence: this.andonSequences[seqIndex],
        index: index,
        editKey: editKey,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('1232323232', result);
        this.updatePanelSequence(result);
        this.startSequence(result, index);
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  /**
   * Add new panel to sequence
   */
  addNewPanel(event, index, newViewKey) {
    let l = this.andonSequences[index].panels.length;
    let duration = l > 0 ? this.andonSequences[index].panels[l - 1].duration : '4';

    if (newViewKey === 'message') {
      this.andonSequences[index].panels.push({
        viewKey: 'message',
        duration: duration,
        title: 'Message',
        message: '',
        playKey: l.toString(),
      } as IAndonSequencePanel);
      this.updatePanelSequence(this.andonSequences[index]);
      this.editPanelDetail(
        // event,
        index,
        l,
        this.andonSequences[index],
        'message'
      );
      return;
    }
    const defaultPanel = {
      viewKey: newViewKey,
      duration: duration,
      chart: false,
      playKey: l.toString(),
    };

    this.andonSequences = this.andonSequences.map((sequence, i) =>
      i === index ? { ...sequence, panels: [...sequence.panels, defaultPanel] } : sequence
    );
    this.updatePanelSequence(this.andonSequences[index]);
  }

  /**
   * Update panel sequence
   */
  updatePanelSequence(sequence) {
    sequence.panels = sequence.panels.map((item, index) => ({
      ...item,
      playKey: index.toString(),
    }));
    if (!sequence.panels) {
      this.initKey();
    }
    this.http.post(`${Ams.Config.BASE_URL}/api/andonSequences`, sequence).subscribe();
  }

  /**
   * Update panel sequence
   */
  updatePanelSequenceInput(sequence: IAndonSequenceConfig, keyName, index, val) {
    sequence.panels[index][keyName] = val;
    this.updatePanelSequence(sequence);
  }

  updateSequence(sequence: IAndonSequenceConfig, keyName, val) {
    sequence = {
      ...sequence,
      [keyName]: val,
    };
    this.updatePanelSequence(sequence);
  }

  /**
   * Delete panel sequence
   */
  deletePanelSequence(sequence, index) {
    this.http.delete(`${Ams.Config.BASE_URL}/api/andonSequences/${sequence.id}`).subscribe(() => {
      this.andonSequences.splice(index, 1);
    });
    this.initKey();
  }

  /**
   * Add new panel sequence
   */
  addNewSequence() {
    // Note that if you pass in your own defaults here they will be used.
    // If you don't, defaults will be provided.
    let defaultNewSequence = {
      name: 'Andon Display ' + (this.andonSequences.length + 1),
      theme: 'dark',
      panels: [],
    };

    this.http
      .post(`${Ams.Config.BASE_URL}/api/andonSequences`, {
        sequence: defaultNewSequence,
      })
      .subscribe((sequence: IAndonSequenceConfig) => {
        const index = this.andonSequences.findIndex((x) => x.id === sequence.id);
        if (index !== -1) {
          this.andonSequences[index] = sequence;
        } else {
          this.andonSequences = [...this.andonSequences, sequence];
        }
      });
  }

  trackByKey = (index: number, item: any): any => {
    return index;
  };

  objectToArray(obj: any) {
    return Object.entries(obj).map(([key, value]) => ({
      key,
      ...(value as any),
    }));
  }

  onDragged(item: IAndonSequencePanel, panels: IAndonSequencePanel[]) {
    const index = panels.indexOf(item);
    panels.splice(index, 1);
  }

  onDrop(event, panels: IAndonSequencePanel[], pIndex: number) {
    let index = event.index;
    if (typeof index === 'undefined') {
      index = panels.length;
    }
    panels.splice(index, 0, event.data);
    this.andonSequences[pIndex].panels = [...panels];
    this.updatePanelSequence(this.andonSequences[pIndex]);
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
    this.stopSequence();
  }
}
