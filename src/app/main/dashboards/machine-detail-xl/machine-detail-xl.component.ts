import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subscription, ReplaySubject, combineLatestWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Ams } from 'src/app/amsconfig';

import { TransitionManageService } from '../../shared/services/transition.service';

import {
  IMetricDefinition,
  IMetricConfig,
  IRollformingStatistics,
  IShiftChoice,
  IDashboardMachine,
  IScheduleEntry,
  IRunblockData,
  IMachineSelection,
} from 'src/app/core/dto';
import { MachineDataService } from '../../shared/services/machine-data.service';

interface TransParam {
  shift?: string;
}

@Component({
  selector: 'app-machine-detail-xl',
  templateUrl: './machine-detail-xl.component.html',
  styleUrls: ['./machine-detail-xl.component.scss'],
})
export class MachineDetailComponentXl implements OnInit, OnDestroy {
  @Input() set machineSelection(value: IMachineSelection) {
    this.machineSelection$.next(value);
  }
  protected readonly machineSelection$ = new ReplaySubject<IMachineSelection>(1);
  selectedMachine: IDashboardMachine;

  protected readonly shiftCode$ = new ReplaySubject<string>(1);

  focusExtent: [Date, Date] = [
    moment().subtract(10, 'minutes').toDate(),
    moment().add(8, 'hours').toDate(),
  ];
  cursor: number = Date.now();
  metrics: (IMetricConfig & { definition: IMetricDefinition })[];
  shifts: IRollformingStatistics[] = [];
  availableShifts: IShiftChoice[] = [];

  shiftIndex: number = 0;

  dashboardMachines: IDashboardMachine[] = [];
  selectedStats: IRollformingStatistics; // Selected stats is separate because it can change with the shift selection

  debugActivities: IScheduleEntry[] = [];
  machineSort = 'machineNumber';
  runBlocks: IRunblockData;
  runBlockFetchBust: { shift: string; lastEndDate: Date; lastFetch: Date } = {
    shift: '',
    lastEndDate: null,
    lastFetch: new Date(new Date().setHours(0, 0, 0, 0)),
  };

  subscriptions_: Subscription[] = [];
  transition$;

  constructor(
    public machineData: MachineDataService,
    private router: Router,
    private route: ActivatedRoute,
    private transManageService: TransitionManageService,
    private http: HttpClient
  ) {
    // I don't think this is working, but it is something that we should get working...
    setTimeout(() => {
      console.log('refreshRunBlocks-timeout');
      this.refreshRunBlocks();
    }, 10000);
  }

  ngOnInit(): void {
    // create observable for machine that matches the machine id
    this.subscriptions_.push(
      this.machineSelection$
        .pipe(combineLatestWith(this.shiftCode$, this.machineData.dashboardMachines$))
        .subscribe(([selection, shiftCode, machines]) => {
          // if the machine changes, reset the shifts
          if (
            this.selectedMachine &&
            this.selectedMachine.machine.machineNumber !== selection.xlId
          ) {
            console.log('resetting shifts');
            this.shifts = [];
            this.availableShifts = [];
          }

          this.selectedMachine = machines.find((x) => x.machine.machineNumber === selection.xlId);

          if (this.shifts.length == 0 && this.selectedMachine) {
            this.http
              .get<IRollformingStatistics[]>(
                Ams.Config.BASE_URL +
                  `/api/machine/${this.selectedMachine.machine.machineNumber}/statistics/shift`
              )
              .subscribe({
                next: (data) => {
                  this.shifts = data;
                  this.availableShifts = this.shifts.map((s, index) => ({
                    index: index,
                    shiftCode: s.startShiftCode,
                    shiftDate: moment(s.startShiftCode.slice(0, -1), 'YYYYMMDD').toDate(),
                    shift: +s.startShiftCode.slice(-1),
                  }));
                  if (shiftCode) {
                    this.shiftIndex = this.availableShifts.findIndex(
                      (x) => x.shiftCode === shiftCode
                    );
                    // If the machine does not have data for this shift, fallback to the default shift.
                    if (this.shiftIndex < 0) {
                      this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: { shift: undefined },
                        queryParamsHandling: 'merge',
                        replaceUrl: true,
                      });
                      this.shiftIndex = 0;
                      this.shiftCode$.next(undefined);
                    }
                  } else {
                    this.shiftIndex = 0;
                  }
                  this.selectMachineData();
                },
                error: (error) => {
                  console.log(error);
                },
              });
          } else {
            this.selectMachineData();
          }
        })
    );

    const shiftCode = this.route.snapshot.paramMap.get('shift');
    this.shiftCode$.next(shiftCode);

    this.transition$ = this.transManageService.transitionObs$.subscribe((params) => {
      this.shiftCode$.next(params.get('shift'));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
    this.transition$.unsubscribe();
  }

  private selectMachineData() {
    if (this.selectedMachine) {
      if (this.shiftIndex > 0) {
        if (this.shifts.length > this.shiftIndex) {
          this.selectedStats = this.shifts[this.shiftIndex];
        } else {
          this.selectedStats = this.selectedMachine.stats;
        }
      } else {
        this.selectedStats = this.selectedMachine.stats;
      }

      this.refreshRunBlocks();

      // debug
      if (this.selectedMachine.scheduleEstimate) {
        this.debugActivities = this.selectedMachine.scheduleEstimate.scheduleBlocks.filter(
          (x) => x.activityType !== 'MachineConfig'
        );
      }
    }
  }

  updateShiftIndex(shiftIdx) {
    // todo: this doesn't feel like the best way to do this. It's working now but I want to review it later.
    this.shiftIndex = shiftIdx;
    this.selectMachineData();
    this.updateQueryString();
  }

  updateQueryString() {
    const exportQuery = {} as { shift?: string };
    if (this.shiftIndex > 0) {
      exportQuery.shift = this.availableShifts.find((x) => x.index === this.shiftIndex)?.shiftCode;
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

  private refreshRunBlocks() {
    // this is kinda a silly way to optimize. A change in either of these two things means there might be new blocks.
    // Better to use Rx somehow. We were calling this http get way too often.
    if (
      this.selectedStats?.startShiftCode &&
      (this.runBlockFetchBust.shift != this.selectedStats?.startShiftCode ||
        this.runBlockFetchBust.lastEndDate != this.selectedStats?.end ||
        // if the last fetch was more than 10 seconds ago, fetch again
        new Date().getTime() - this.runBlockFetchBust.lastFetch.getTime() > 10000)
    ) {
      this.http
        .get<IRunblockData>(
          Ams.Config.BASE_URL +
            `/api/machine/${this.selectedMachine.machine.machineNumber}/${this.selectedStats?.startShiftCode}/runblocks`
        )
        .subscribe({
          next: (data) => {
            this.runBlocks = data;
            this.runBlockFetchBust = {
              shift: this.selectedStats?.startShiftCode,
              lastEndDate: this.selectedStats?.end,
              lastFetch: new Date(),
            };
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  preventDefault(e) {
    e.preventDefault();
  }

  disableScroll(ev) {
    this.preventDefault(ev);
    const parent = document.querySelector<HTMLElement>('#dashboard-machines');
    // console.log('disabled', parent.getBoundingClientRect());
    parent.style.overflow = 'hidden';
    parent.style.marginRight = '4px';
  }

  enableScroll() {
    const parent = document.querySelector<HTMLElement>('#dashboard-machines');
    parent.style.overflow = 'auto';
    parent.style.marginRight = '0';
  }
}
