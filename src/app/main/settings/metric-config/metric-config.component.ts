import { Component, Inject, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { combineLatestWith, map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  IMachine,
  IMetricConfig,
  IMetricDefinition,
  IMachineMetricSettings,
} from 'src/app/core/dto';
import { UnitsService } from '../../shared/services/units.service';
import { UserHasRoles } from '../../shared/services/store/user/selector';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { putAction } from '../../shared/services/clientData.actions';
import { Ams } from 'src/app/amsconfig';
interface IViewModel extends IMachine {
  documentId: string;
  machineNumber: number;
  settings: (IMetricConfig & {
    definition: IMetricDefinition;
    maxValueUser: number;
    minValueUser: number;
    okRangeStartUser: number;
    okRangeEndUser: number;
    targetValueUser: number;
  })[];
}

@Component({
  selector: 'app-metric-config',
  templateUrl: './metric-config.component.html',
  styleUrls: ['./metric-config.component.scss'],
})
export class MetricConfigComponent implements OnDestroy {
  machines: IViewModel[];
  userHasEditorRole: boolean = false;

  subscriptions_: Subscription[] = [];
  constructor(
    private clientDataStore: ClientDataStore,
    private unitsService: UnitsService,
    private _snackBar: MatSnackBar,
    private store: Store,
    private http: HttpClient
  ) {
    this.subscriptions_ = [
      this.store
        .select(UserHasRoles(['tooling-editor', 'administrator'], false))
        .subscribe((userHasEditorRole) => {
          this.userHasEditorRole = userHasEditorRole;
        }),

      clientDataStore
        .SelectMetricDefinitions()
        .pipe(
          filter(this.NOTEMPTY),
          combineLatestWith(
            clientDataStore.SelectMachineMetricSettings().pipe(filter(this.NOTEMPTY)),
            clientDataStore.SelectMachines().pipe(filter(this.NOTEMPTY))
          ),
          map(([metricDefinitions, metricSettings, machines]) => ({
            metricDefinitions,
            metricSettings,
            machines,
          }))
        )
        .subscribe(
          ({
            metricDefinitions,
            metricSettings,
            machines,
          }: {
            metricDefinitions: IMetricDefinition[];
            metricSettings: IMachineMetricSettings[];
            machines: IMachine[];
          }) => {
            let metricSettingsVm = metricSettings.map((ms) =>
              Object.assign(
                {},
                {
                  machineNumber: ms.machineNumber,
                  documentId: ms.documentId,
                  settings: metricDefinitions.map((md) => {
                    let setting = ms.settings.find((s) => s.metricId === md.metricId);
                    if (!setting) {
                      console.log('no setting for', md.metricId);
                      return {
                        ...md,
                        definition: md,
                        maxValueUser: 0,
                        minValueUser: 0,
                        okRangeStartUser: 0,
                        okRangeEndUser: 0,
                        targetValueUser: 0,
                      };
                    }
                    return Object.assign({}, setting, {
                      ...md,
                      definition: md,
                      ...setting,
                      maxValueUser: this.getUserValue(setting.maxValue, md.primaryUnits),
                      minValueUser: this.getUserValue(setting.minValue, md.primaryUnits),
                      okRangeStartUser: this.getUserValue(setting.okRangeStart, md.primaryUnits),
                      okRangeEndUser: this.getUserValue(setting.okRangeEnd, md.primaryUnits),
                      targetValueUser: this.getUserValue(setting.targetValue, md.primaryUnits),
                    });
                  }),
                }
              )
            );
            this.machines = machines.map((machine) => {
              let metricSet = metricSettingsVm.find((ms) => ms.machineNumber === machine.id);
              return { ...machine, ...metricSet } as any;
            });
          }
        ),
    ];
  }

  NOTEMPTY = (x) => x.length > 0;

  getUserValue(baseValue: number, baseUnit: string): number {
    if (baseUnit === '%') {
      return baseValue * 100; // use unitsService for rounding?
    }
    return this.unitsService.convertUnits(baseValue, baseUnit, 3);
  }

  getBaseValue(userValue: number, baseUnit: string, userUnit: string) {
    if (baseUnit === '%') {
      return userValue / 100; // use unitsService for rounding?
    }
    return this.unitsService.convertUnits(userValue, userUnit, 3, baseUnit);
  }

  /*
   * Update the metric
   */
  updateMetric(
    machine: IViewModel,
    metricId,
    memberName,
    objKey: string = '',
    val: string | number = ''
  ) {
    if (!this.userHasEditorRole) {
      this.toast('You do not have permission to edit metrics');
      return;
    }

    let metric = machine.settings.find((m) => m.metricId === metricId);

    //convert user units
    let baseValue = metric[memberName];
    metric[objKey] = val;
    if (typeof baseValue !== 'boolean') {
      const userUnit = this.unitsService.getUserUnits(metric.definition.primaryUnits);
      baseValue = this.getBaseValue(
        metric[memberName + 'User'],
        metric.definition.primaryUnits,
        userUnit
      );
    }
    metric[memberName] = baseValue;

    // Get rid of all that stuff we added
    const payload: IMetricConfig[] = machine.settings.map((setting) => {
      return {
        metricId: setting.metricId,
        targetValue: setting.targetValue,
        okRangeStart: setting.okRangeStart,
        okRangeEnd: setting.okRangeEnd,
        maxValue: setting.maxValue,
        minValue: setting.minValue,
        showInMini: setting.showInMini,
        showInLarge: setting.showInLarge,
      };
    });

    this.http
      .put(`${Ams.Config.BASE_URL}/api/machine/${machine.machineNumber}/metricsettings`, payload)
      .subscribe();
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  trackByKey = (index: number, item: any): any => {
    return item.metricId;
  };

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}
