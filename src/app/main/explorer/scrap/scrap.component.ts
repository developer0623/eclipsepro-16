import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.scss'],
})
export class ScrapComponent implements OnDestroy, OnInit {
  data = [];
  cfData: CrossFilterData;
  dataSub_: Subscription;
  subscriptions_: Subscription[] = [];
  fileDownloadQueryString: string;

  constructor(
    private store: Store,
    public appService: AppService,
    private unitsService: UnitsService,
    public productionExplorerDataService: ProductionExplorerDataService,
    private transManageService: TransitionManageService
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
    this.cfData = loadCrossFilter(
      this.data,
      (d) =>
        this.filter(d) &&
        moment(d.date).isSameOrAfter(this.productionExplorerDataService.startDate, 'day') &&
        moment(d.date).isSameOrBefore(this.productionExplorerDataService.endDate, 'day'),
      this.reduceAdd,
      this.reduceRemove,
      this.reduceOrder
    );
  }

  reduceAdd(p: number, v: IData): number {
    p += v.scrapLengthLocal;
    return p;
  }

  reduceRemove(p: number, v: IData): number {
    p -= v.scrapLengthLocal;
    return p;
  }

  filter(item: IData) {
    return item.scrapLengthFt > 0;
  }

  reduceOrder(item: IReducedData) {
    return item.scrapLengthLocal;
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
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
    this.dataSub_.unsubscribe();
  }
}
