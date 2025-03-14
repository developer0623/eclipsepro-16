import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Subscription, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { IData, IReducedData, loadCrossFilter, CrossFilterData } from '../explorer-reference';
import { ProductionExplorerDataService } from '../../shared/services/production-explorer-data.service';
import { TransitionManageService } from '../../shared/services/transition.service';
import { UnitsService } from '../../shared/services/units.service';

import {
  selectExplorerData,
  updateLocalUnits,
} from '../../shared/services/store/productionexplorer/selectors';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-good-production',
  templateUrl: './good-production.component.html',
  styleUrls: ['./good-production.component.scss'],
})
export class GoodProductionComponent implements OnDestroy, OnInit {
  data = [];
  cfData: CrossFilterData;
  dataSub_: Subscription;
  subscriptions_: Subscription[] = [];
  fileDownloadQueryString: string;
  private loadTrigger$ = new Subject<void>();

  constructor(
    public appService: AppService,
    private unitsService: UnitsService,
    public productionExplorerDataService: ProductionExplorerDataService,
    private transManageService: TransitionManageService,
    private store: Store
  ) {
    this.productionExplorerDataService.init();
    this.fileDownloadQueryString = this.onGetDownloadLink();
    this.dataSub_ = this.store
      .select(selectExplorerData)
      .pipe(map((data) => updateLocalUnits(this.unitsService)(data)))
      .subscribe((newData) => {
        this.productionExplorerDataService.onUpdateMinMax(
          moment(newData.range.minDate),
          moment(newData.range.maxDate)
        );
        this.appService.setLoading(false);
        this.data = newData.explorerData;
        this.load();
      });
  }

  load() {
    const startDate = moment(this.productionExplorerDataService.startDate).startOf('day');
    const endDate = moment(this.productionExplorerDataService.endDate).endOf('day');

    this.cfData = loadCrossFilter(
      this.data,
      (d) => this.filter(d) && this.isDateInRange(d.date, startDate, endDate),
      this.reduceAdd,
      this.reduceRemove,
      this.reduceOrder
    );
  }
  isDateInRange(date: string, startDate: moment.Moment, endDate: moment.Moment) {
    const d = moment(date);
    return d.isBetween(startDate, endDate, 'day', '[]');
  }

  reduceAdd(p: number, v: IData): number {
    p += v.goodLocal;
    return p;
  }

  reduceRemove(p: number, v: IData): number {
    p -= v.goodLocal;
    return p;
  }

  filter(item: IData) {
    return item.goodFt > 0;
  }

  reduceOrder(item: IReducedData) {
    return item.goodLocal;
  }
  update() {
    this.appService.setLoading(true);
    this.productionExplorerDataService.onDateRangeChange();
    if (
      this.productionExplorerDataService.startDate &&
      this.productionExplorerDataService.endDate
    ) {
      this.fileDownloadQueryString = this.onGetDownloadLink();
      this.cfData.update();
    }
  }

  resetAll() {
    this.cfData.resetAll();
  }

  onGetDownloadLink() {
    return `/api/productionexplorer/download?startDate=${this.productionExplorerDataService.startDate
      .toDate()
      .toISOString()}&endDate=${this.productionExplorerDataService.endDate.toDate().toISOString()}`;
  }

  ngOnInit(): void {
    this.appService.setLoading(true);
    // this.transition$ = this.transManageService.transitionObs$.subscribe((transition) => {
    //   let transitionOptions: TransitionOptions = transition.options();
    //   if (transitionOptions.source === 'url') {
    //     this.productionExplorerDataService.onGetParamsFromUrl(transition.params());
    //   }
    // });
    this.loadTrigger$.pipe(debounceTime(500)).subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
    this.dataSub_.unsubscribe();
  }
}
