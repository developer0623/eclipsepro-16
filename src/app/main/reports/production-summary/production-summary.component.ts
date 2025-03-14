import { Component, Inject } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router  } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { scan, filter, tap, map, switchMap } from 'rxjs/operators';
import { IMachine, IProductionSummaryReportRecord } from 'src/app/core/dto';
import { MaterialUsageGroup } from '../report-type';
import { Ams } from 'src/app/amsconfig';
import { PrintDialogComponent } from './components/print-dialog/print-dialog.component';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { selectSystemPreferences } from '../../shared/services/store/misc/selectors';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-production-summary',
  templateUrl: './production-summary.component.html',
  styleUrls: ['./production-summary.component.scss'],
})
export class ProductionSummaryComponent {
  summaryList: MaterialUsageGroup[];
  machines: (IMachine & { isChecked: boolean })[];
  endDate: moment.Moment = moment();
  startDate: moment.Moment = moment();
  startMaxDate: Date;
  endMaxDate: Date;
  durations = ['Day', 'Week', 'Month', 'Custom'];
  selectedDuration = this.durations[0];
  selectedMachinesNum: number;
  factoryName: string;
  shiftMenuTitle = 'All';

  reportFilterSubject$: BehaviorSubject<{
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    duration?: string;
    customDurationLength?: number;
    customDuration?: string;
    selectedMeasure?: string;
    machines?: number[];
    shifts?: number[];
    measure?: string;
  }>;

  calType: string = 'month';
  custEndDate: moment.Moment;
  custStartDate: moment.Moment;

  shiftMenus = [
    { name: 1, isChecked: true },
    { name: 2, isChecked: true },
    { name: 3, isChecked: true },
  ];

  measureMenu = ['Length', 'Area', 'Weight'];
  selectedMeasure = this.measureMenu[0];
  //todo: localize the help
  headers = [
    {
      index: 0,
      title: 'Total GOOD',
      class: 'column-good-scrap',
      description:
        'Total amount of good production by finished length or weight as well as the total number of good parts. These totals include parts that were originally good as well as those reclaimed from previously reported scrap.<br/><br/>Calculation: sum(number of good parts * finished part length)',
    },
    {
      index: 1,
      title: 'Net SCRAP',
      class: 'column-good-scrap',
      description:
        'Total amount of material consumed that did not end up as a good part. This includes bad parts as well as scrap caused by manual shears, coil thread-up & tail-out, etc. <br/><br/>Note: for some products the length of material consumed does not equal the finished part length. In those cases the total good length plus total net scrap will not add up to match the total length consumed. <br/><br/>Calculation: sum(material consumed) - sum(number of good parts * expected material consumed/part)',
    },
    {
      index: 8,
      class: 'column-asy second-hide',
      title: 'RECLAIMED',
      description:
        'The amount of material that was previously reported as scrap that was reclaimed as good. This value is also included in the Total Good column.',
    },
    {
      index: 2,
      title: 'RUNNING THROUGHPUT',
      class: 'column-running',
      description:
        'Average production rate when the machine is running. <br/><br/>Calculation: sum(Good product) / sum(Run minutes)',
    },
    {
      index: 3,
      title: 'OEE',
      class: 'column-oee-target',
      description:
        'OEE = Overall Equipment Effectiveness<br/>This is the ratio of actual good production to the theoretical output if the machine ran 100% of the scheduled (available) production time at 100% of the rated speed for the current product and 100% yield (no bad parts). <br/><br/>Calculation: sum(Good product) / sum( Available Time * Rated Speed) ) where Available Time = total time - exempt time',
    },
    {
      index: 4,
      title: 'TARGET',
      class: 'column-oee-target',
      description:
        'Ratio of actual good production to the theoretical output if the machine ran according to established standards. <br/><br/>100% Target means all coil, material, tooling changeovers take the time given by the standard work definition for a safe change & besides changeovers, 100% of the scheduled production time is spent running, the machine runs at 100% of the rated speed for the current product, 100% of the parts produced are good. <br/><br/>Calculation: sum(Good product) / sum( (Available - Standard Changeover time) * Rated Speed) ) where Available Time = total time - exempt time',
    },
    {
      index: 5,
      title: 'AVAILABILITY',
      class: 'column-asy first-hide',
      description:
        'Simple definition: the percentage of scheduled production time the machine is actually running. Note: using time-based percentage only works when the range of products being produced all have the same target production speed.  When calculating an aggregate value across a range of mixed product target speeds, it is necessary to use ratios of production values (length, weight, etc). <br/><br/>Calculation: sum(Running Time * Rated Speed) / sum( Available Time * Rated Speed) ) where Available Time = total time - exempt time',
    },
    {
      index: 6,
      title: 'SPEED',
      class: 'column-asy first-hide',
      description:
        'The ratio of actual running speed to the target production speed for the product.  The target production speed is defined based on the equipment capabilities for the current product and length.  When calculating an aggregate value across a range of mixed product target speeds, it is necessary to use ratios of production values (length, weight, etc). <br/><br/>Calculation:  sum(Good & Bad Quantity * Part Length) / sum( Available Time * Rated Speed) ) where Available Time = total time - exempt time',
    },
    {
      index: 7,
      title: 'YIELD',
      class: 'column-asy first-hide',
      description:
        'The percentage of parts that were good.  <br/>Note: good parts includes parts that were reworked from bad parts or reclaimed from scrap material. \nCalculation: sum(Good product) / sum(Good & Bad Quantity * Part Length)',
    },
    {
      index: 12,
      title: 'TOTAL CUTS',
      class: 'column-cnt second-hide',
      description: '',
    },
    {
      index: 10,
      title: 'COIL ▲',
      class: 'column-cnt second-hide',
      description: '',
    },
    {
      index: 11,
      title: 'MATL ▲',
      class: 'column-cnt second-hide',
      description: '',
    },
    {
      index: 12,
      title: 'TOOL ▲',
      class: 'column-cnt second-hide',
      description: '',
    },

    {
      index: 13,
      title: 'TIMEBAR',
      class: 'column-time-bar second-hide',
      description:
        'The downtime summarized into five categories. <br/><br/>(If the numbers do not add up to 100% it means there are delay code definitions that have not been assigned to a category.)',
    },
  ];

  customDate = {
    startDate: moment(),
    endDate: moment(),
    duration: new Date(),
    isOpen: false,
  };
  customDurations = ['days', 'weeks', 'months'];
  customSelectedDuration: 'days' | 'weeks' | 'months' = 'days';
  durationLength: number = 1;

  subscriptions_: Subscription[] = [];

  constructor(
    public clientDataStore: ClientDataStore,
    public appService: AppService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private store: Store
  ) {
    const localduration = localStorage.getItem('report.prodSum.Duration');
    const startDate = this.route.snapshot.paramMap.get('startDate');
    if (startDate) {
      const m = moment(startDate);
      if (m.isValid()) {
        this.startDate = m;
        this.calculateEndDate(this.startDate);
      }
    }
    const duration = this.route.snapshot.paramMap.get('duration');
    if (duration) {
      this.selectedDuration = duration;
    } else if (!!localduration) {
      this.selectedDuration = localduration;
    }

    this.reportFilterSubject$ = new BehaviorSubject({
      startDate: this.startDate,
      endDate: this.endDate,
      duration: this.selectedDuration,
      machines: [],
    });

    this.reportFilterSubject$
      .pipe(
        scan((last, next) => Object.assign(last, next)),
        filter((filter) => filter.machines.length > 0),
        tap(() => appService.setLoading(true)),
        tap((query) => this.updateQueryString(query)),
        map((filters) => {
          const query = {
            ...filters,
            startDate: filters.startDate.format('YYYY-MM-DD'),
            endDate: filters.endDate.format('YYYY-MM-DD'),
          };

          return this.http.get<IProductionSummaryReportRecord[]>(
            `${Ams.Config.BASE_URL}/api/productionSummary`,
            {
              params: query,
            }
          );
        }),
        switchMap((source) => source)
      )
      .subscribe((summaryData) => {
        let newItems = [];
        this.machines.forEach((machine) => {
          if (machine.isChecked) {
            let item = summaryData.find((r) => machine.id === r.id);
            newItems.push({ ...item, machineName: machine.description });
          }
        });
        this.summaryList = newItems;
        appService.setLoading(false);
      });

    const machines = this.route.snapshot.paramMap.get('machines')

    const qsMachines: number[] = machines
      ? JSON.parse(machines).map((m) => Number(m))
      : undefined;

    this.subscriptions_ = [
      this.clientDataStore
        .SelectMachines()
        .pipe(
          filter((ms) => ms && ms.length > 0), // Ensures non-empty array
          map((ms) => ms.slice().sort((a, b) => a.description.localeCompare(b.description))) // Sorts machines
        )
        .subscribe((machines) => {
          this.machines = machines.map((m) => ({
            ...m,
            isChecked: !qsMachines || qsMachines.includes(m.machineNumber),
          }));
          if (!qsMachines) {
            this.reportFilterSubject$.next({
              machines: this.machines.map((m) => m.machineNumber),
            });
          } else {
            this.reportFilterSubject$.next({
              machines: qsMachines,
            });
          }
        }),

      this.store.select(selectSystemPreferences).subscribe((prefs) => {
        this.factoryName = prefs.plantName;
      }),
    ];
  }

  onlyAllowDate = (d: moment.Moment | null) => {
    const day = (d || moment()).weekday();
    if (this.selectedDuration === 'Week') {
      return day === 0;
    }
    return true;
  };

  private calculateEndDate(startDate) {
    this.startDate = moment(startDate);
    if (this.selectedDuration === 'Week') {
      this.endDate = this.startDate.clone().add(6, 'days');
    } else if (this.selectedDuration === 'Month') {
      this.endDate = this.startDate.clone().add(this.startDate.daysInMonth() - 1, 'days');
    } else if (this.selectedDuration === 'Custom') {
      let newDate;
      if (this.customSelectedDuration === 'days') {
        newDate = this.startDate.add(this.durationLength - 1, this.customSelectedDuration);
      } else {
        newDate = this.startDate.clone().add(this.durationLength, this.customSelectedDuration);
        newDate = newDate.clone().add(-1, 'Days');
      }
      this.endDate = newDate;
    } else {
      this.endDate = this.startDate;
    }
  }

  private initDate() {
    const today = moment();
    this.calType = 'month';
    switch (this.selectedDuration) {
      case 'Week': {
        const dayWeek = today.weekday() % 7;
        this.startDate = today.clone().add(dayWeek * -1, 'days');
        this.endDate = today.clone().add(6 - dayWeek, 'days');
        break;
      }
      case 'Month':
        const dayMonth = today.date();
        const month = today.daysInMonth();
        this.startDate = today.clone().add(dayMonth * -1 + 1, 'days');
        this.endDate = today.clone().add(month - dayMonth, 'days');
        this.calType = 'year';
        break;
      case 'Custom':
        this.startDate = today;
        this.endDate = today;
        this.customDate.startDate = today;
        this.customDate.endDate = today;
        this.durationLength = 1;
        this.customSelectedDuration = 'days';
        break;
      default: {
        this.startDate = today;
        this.endDate = today;
        break;
      }
    }
  }

  private updateQueryString(query) {
    const deleteProperty = (key, { [key]: _, ...newObj }) => newObj;

    //todo: start supporting custom dates
    //get rid of custom properties in the query string
    let exportQuery = deleteProperty(
      'customDuration',
      deleteProperty('customDurationLength', query)
    );
    exportQuery = {
      ...exportQuery,
      startDate: moment(query.startDate).format('YYYY-MM-DD'),
      endDate: moment(query.endDate).format('YYYY-MM-DD'),
    };
    // for now, we can remove the endDate also. It will go back for Custom durations
    exportQuery = deleteProperty('endDate', exportQuery);
    this.router.navigate([], {
      queryParams: exportQuery,
    });
  }

  initDate_ = () => {
    this.initDate();
    this.reportFilterSubject$.next({
      startDate: this.startDate,
      endDate: this.endDate,
      duration: this.selectedDuration,
    });
  };

  onChangeDuration(item) {
    this.selectedDuration = item;
    this.initDate_();
    if (item !== 'Custom')
      // for now, don't persist custom durations
      localStorage.setItem('report.prodSum.Duration', item);
  }
  onChangeShifts(items) {
    this.shiftMenus = items;
    this.reportFilterSubject$.next({
      shifts: this.shiftMenus.filter((x) => x.isChecked).map((x) => x.name),
    });
    this.getShiftMenuTitle();
  }

  getShiftMenuTitle() {
    let count = 0;
    this.shiftMenus.map((menu) => {
      if (menu.isChecked && !count) {
        this.shiftMenuTitle = menu.name.toString();
        count++;
      } else if (menu.isChecked && count) {
        this.shiftMenuTitle += ` & ${menu.name}`;
        count++;
      }
    });

    if (count === this.shiftMenus.length) {
      this.shiftMenuTitle = 'All';
    }
  }
  onChangeMeasure(item) {
    this.selectedMeasure = item;
    this.reportFilterSubject$.next({ measure: this.selectedMeasure });
  }

  // select startdate on calendar
  onChangeStartDate = () => {
    this.calculateEndDate(this.startDate);
    this.reportFilterSubject$.next({
      startDate: this.startDate,
      endDate: this.endDate,
      duration: this.selectedDuration,
    });
  };

  // next and prev button
  onChangeDate(step) {
    let skip = 0;
    let newDate;
    if (this.selectedDuration === 'Week') {
      skip = 7;
      newDate = this.startDate.clone().add(step * skip, 'days');
    } else if (this.selectedDuration === 'Month') {
      if (step > 0) {
        newDate = this.endDate.clone().add(step, 'days');
      } else if (step < 0) {
        skip = this.startDate.clone().add(step, 'days').daysInMonth();
        newDate = this.startDate.clone().add(step * skip, 'days');
      }
    } else if (this.selectedDuration === 'Custom') {
      newDate = this.startDate.clone().add(this.durationLength * step, this.customSelectedDuration);
    } else {
      skip = 1;
      newDate = this.startDate.clone().add(step * skip, 'days');
    }
    this.startDate = newDate;
    this.onChangeStartDate();
  }

  onOpenCustomDate() {
    this.customDate.isOpen = true;
    if (this.startDate !== this.customDate.startDate) {
      this.customDate = {
        ...this.customDate,
        startDate: this.startDate.clone(),
        endDate: this.startDate.clone(),
      };
    }
  }

  onChangeCustomStartDate() {
    this.onClickCustomDuration();
  }

  onChangeCustomEndDate() {
    this.custEndDate = moment(this.customDate.endDate);
    this.custStartDate = moment(this.customDate.startDate);
    let diff = this.custEndDate.dayOfYear() - this.custStartDate.dayOfYear() + 1;
    if (diff < 0) {
      if (this.custStartDate.isLeapYear()) {
        this.durationLength = 366 + diff;
      } else {
        this.durationLength = 365 + diff;
      }
    } else {
      this.durationLength = diff;
    }
    this.customSelectedDuration = 'days';
  }

  onClickCustomDuration() {
    this.startDate = this.customDate.startDate.clone();
    if (this.customSelectedDuration === 'days') {
      this.customDate.endDate = this.startDate
        .clone()
        .add(this.durationLength - 1, this.customSelectedDuration);
    } else {
      let newDate = this.startDate.clone().add(this.durationLength, this.customSelectedDuration);
      this.customDate.endDate = newDate.clone().add(-1, 'days');
    }
  }

  onCancelCustomDate() {
    this.customDate.isOpen = false;
  }

  onApplyCustomDate() {
    this.startDate = moment(this.customDate.startDate);
    this.endDate = moment(this.customDate.endDate);
    this.customDate.isOpen = false;
    this.reportFilterSubject$.next({
      startDate: this.startDate,
      endDate: this.endDate,
      customDurationLength: this.durationLength,
      customDuration: this.customSelectedDuration,
    });
  }

  onChangeMachines(items) {
    this.machines = items;
    this.reportFilterSubject$.next({
      machines: this.machines.filter((x) => x.isChecked).map((m) => m.machineNumber),
    });
  }

  openPrintPreview($event) {
    const dialogRef = this.dialog.open(PrintDialogComponent, {
      maxWidth: '100vw',
      data: {
        data: this.summaryList,
        duration: this.selectedDuration,
        startDate: this.startDate,
        endDate: this.endDate,
        shift: this.shiftMenuTitle,
        factoryName: this.factoryName,
      },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}
