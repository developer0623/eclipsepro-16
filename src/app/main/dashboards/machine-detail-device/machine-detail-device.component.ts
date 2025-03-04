import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, combineLatestWith, ReplaySubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { TransitionManageService } from '../../shared/services/transition.service';
import {
  IRunblockData,
  IMachineSelection,
  IDashboardDevice,
  IDeviceShiftStatistics,
  IShiftChoice,
  IDeviceProducedGoods,
} from 'src/app/core/dto';
import { MachineDataService } from '../../shared/services/machine-data.service';
import { Ams } from 'src/app/amsconfig';
import { AmsDatesPipe } from '../../shared/pipes/dates.pipe';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-machine-detail-device',
  templateUrl: './machine-detail-device.component.html',
  styleUrls: ['./machine-detail-device.component.scss'],
})
export class MachineDetailComponentDevice implements OnInit, OnDestroy {
  @Input() set machineSelection(value: IMachineSelection) {
    this.machineSelection$.next(value);
  }
  protected readonly shiftCode$ = new ReplaySubject<string>(1);
  protected readonly machineSelection$ = new ReplaySubject<IMachineSelection>(1);

  selectedDevice: IDashboardDevice;
  selectedShift: IDeviceShiftStatistics;
  shifts: IDeviceShiftStatistics[] = [];
  availableShifts: IShiftChoice[] = [];
  shiftIndex: number = 0;

  runBlocks: IRunblockData;
  runBlockFetchBust: { shift: string; lastEndDate: Date; lastFetch: Date } = {
    shift: '',
    lastEndDate: null,
    lastFetch: new Date(new Date().setHours(0, 0, 0, 0)),
  };

  subscriptions_: Subscription[] = [];

  constructor(
    public machineData: MachineDataService,
    private router: Router,
    private route: ActivatedRoute,
    private transManageService: TransitionManageService,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    // this isn't working...
    // setTimeout(() => {
    //   console.log('refreshRunBlocks-timeout');
    //   this.refreshRunBlocks();
    // }, 1000);
  }

  ngOnInit(): void {
    const shiftCode = this.route.snapshot.paramMap.get('shift');
    this.shiftCode$.next(shiftCode);

    // create observable for machine that matches the machine id
    this.subscriptions_.push(
      this.machineSelection$
        .pipe(
          combineLatestWith(
            this.shiftCode$,
            this.machineData.dashboardDevices$.pipe(throttleTime(100))
          )
        )
        .subscribe(([selection, shiftCode, devices]) => {
          //console.log('~~~~~~~~~~~~~~~~machine-detail-device', selection, shiftCode, devices);
          // if the machine changes, reset the shifts
          if (this.selectedDevice && this.selectedDevice.deviceId !== selection.deviceId) {
            console.log('resetting shifts');
            this.shifts = [];
            this.availableShifts = [];
          }
          this.selectedDevice = devices.find((x) => x.deviceId === selection.deviceId);
          console.log('~~~~~~~~~selectedDevice', this.selectedDevice);
          if (!this.selectedDevice) {
            return;
          }

          if (this.availableShifts.length == 0) {
            this.http
              .get<string[]>(
                Ams.Config.BASE_URL + `/_api/device/${this.selectedDevice.deviceId}/shifts`
              )
              .subscribe({
                next: (data) => {
                  this.availableShifts = data
                    .slice()
                    .sort((a, b) => Number(b) - Number(a))
                    .map((s, index) => ({
                      index: index,
                      shiftCode: s,
                      shiftDate: moment(s, 'YYYYMMDD').toDate(),
                      shift: 0,
                    }));
                  //console.log('availableShifts', this.availableShifts);
                  this.selectMachineData(shiftCode);
                },
                error: (error) => {
                  console.log(error);
                },
              });
          }

          // every time we get new data, grab the run blocks
          this.selectMachineData(shiftCode);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }

  private selectMachineData(shiftCode?: string) {
    //console.log('>>>>>>selectMachineData', shiftCode);
    if (!this.selectedDevice) {
      return;
    }

    if (!shiftCode || this.selectedDevice.shiftStats?.shiftCode === shiftCode) {
      // we are at the most recent shift. Use what comes from the service since it will be updated from SignalR.
      this.selectedShift = this.selectedDevice.shiftStats;
      this.refreshRunBlocks();
      this.refreshProducedGoods();
      return;
    }

    // do we need to do something if there are no available shifts? We already force the fetch above.
    if (this.availableShifts.length > 0) {
      // todo: refactor this, too many ifs
      //console.log('^^^^^^^66', shiftCode, this.availableShifts);
      if (this.selectedShift?.shiftCode !== shiftCode) {
        this.shiftIndex = this.availableShifts.findIndex((x) => x.shiftCode === shiftCode);
        // If the machine does not have data for this shift, fallback to the default shift.
        if (this.shiftIndex < 0) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { shift: undefined },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
          // I think the above was supposed to trigger a $transition$ event, but it doesn't seem to be working. Doing this also:
          this.shiftIndex = 0;
          this.shiftCode$.next(undefined);
        } else {
          // now let's get the stats for this shift
          let shiftDataIndex = this.shifts.findIndex((x) => x.shiftCode === shiftCode);
          if (shiftDataIndex >= 0) {
            this.selectedShift = this.shifts[shiftDataIndex];
          } else {
            this.http
              .get<IDeviceShiftStatistics>(
                Ams.Config.BASE_URL +
                  `/_api/device/${this.selectedDevice.deviceId}/statistics/${shiftCode}`
              )
              .subscribe({
                next: (data) => {
                  console.log('found shift data', data);
                  this.shifts.push(data);
                  this.selectedShift = data;
                },
                error: (error) => {
                  console.log(error);
                },
              });
          }
        }
      }
    }

    this.refreshRunBlocks(shiftCode);
    this.refreshProducedGoods(shiftCode);
  }

  producedGoodsColumns = [
    {
      field: 'partId',
      headerName: 'part',
      filter: 'agTextColumnFilter',
      hide: false,
    },
    {
      field: 'totalParts',
      headerName: 'quantity',
      filter: 'agNumberColumnFilter',
      hide: false,
    },
    {
      field: 'totalCycles',
      headerName: 'operations',
      filter: 'agNumberColumnFilter',
      hide: false,
    },
    {
      field: 'cyclesPerHour',
      headerName: 'avgOpsPerHour',
      valueFormatter: (params) => params.value.toFixed(2),
      hide: false,
    },
    {
      field: 'operator',
      headerName: 'operatorName',
      filter: 'agTextColumnFilter',
      hide: false,
    },
    {
      field: 'runMinutes',
      headerName: 'runMinutes',
      valueFormatter: (params) => params.value.toFixed(2),
      hide: false,
    },
    {
      field: 'startDate',
      headerName: 'Start',
      hide: true,
      valueFormatter: (params) => {
        return AmsDatesPipe.prototype.transform(params.value);
      },
    },
    {
      field: 'endDate',
      headerName: 'End',
      hide: true,
      valueFormatter: (params) => {
        return AmsDatesPipe.prototype.transform(params.value);
      },
    },
  ];
  producedGoodsGridApi!: GridApi<IDeviceProducedGoods>;
  producedGoodsAgGridOptions: GridOptions = {
    headerHeight: 25,
    defaultColDef: {
      sortable: true,
      //resizable: true,
      headerValueGetter: (params) => this.translate.instant(params.colDef.headerName),
      tooltipValueGetter: (params) => {
        if (typeof params.value === 'string') {
          return params.value;
        }
        return;
      },
    },
    columnDefs: this.producedGoodsColumns,
    onGridReady: (params: GridReadyEvent<IDeviceProducedGoods>) => {
      this.producedGoodsGridApi = params.api;
    },
  };

  updateShift(shift: IShiftChoice) {
    console.log('updateShift', shift);
    this.shiftCode$.next(shift.shiftCode);
    this.updateQueryString(shift.shiftCode);
  }

  updateQueryString(shiftCode?: string) {
    const exportQuery = {} as { shift?: string };
    if (shiftCode) {
      exportQuery.shift = shiftCode;
    } else {
      exportQuery.shift = undefined;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: exportQuery,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private refreshRunBlocks(shiftCode?: string) {
    if (this.selectedShift) {
      // this is kinda a silly way to optimize. A change in either of these two things means there might be new blocks.
      // Better to use Rx somehow. We were calling this http get way too often.
      // if (
      //   this.selectedStats?.startShiftCode &&
      //   (this.runBlockFetchBust.shift != this.selectedStats?.startShiftCode ||
      //     this.runBlockFetchBust.lastEndDate != this.selectedStats?.end ||
      //     // if the last fetch was more than 10 seconds ago, fetch again
      //     new Date().getTime() - this.runBlockFetchBust.lastFetch.getTime() > 10000)
      // ) {
      if (!shiftCode) {
        shiftCode = this.selectedShift.shiftCode;
      }
      console.log('refreshRunBlocks', shiftCode);
      this.http
        .get<IRunblockData>(
          Ams.Config.BASE_URL +
            `/_api/device/${this.selectedDevice.deviceId}/${shiftCode}/runblocks`
        )
        .subscribe({
          next: (data) => {
            this.runBlocks = data;
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  private refreshProducedGoods(shiftCode?: string) {
    if (this.selectedShift) {
      if (!shiftCode) {
        shiftCode = this.selectedShift.shiftCode;
      }
      console.log('refreshProducedGoods', shiftCode);
      this.http
        .get<IDeviceProducedGoods[]>(
          Ams.Config.BASE_URL +
            `/_api/device/${this.selectedDevice.deviceId}/producedGoods/${shiftCode}`
        )
        .subscribe({
          next: (data) => {
            console.log('producedGoods', data);
            if (this.producedGoodsGridApi) {
              setTimeout(() => {
                this.producedGoodsGridApi.setGridOption('rowData', data);
                console.log('producedGood Done');
              }, 0);
              //this.producedGoodsGridApi.setGridOption('rowData', data);
            }
          },
          error: (error) => {
            console.log(error);
            if (this.producedGoodsAgGridOptions) {
              //this.producedGoodsGridApi.setGridOption('rowData', []);
            }
          },
        });
    }
  }
}
