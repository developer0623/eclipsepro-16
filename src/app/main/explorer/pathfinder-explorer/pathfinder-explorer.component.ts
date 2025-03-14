import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DeviceCrossFilterData,
  IPathfinderExplorerData,
  IPathfinderReducedData,
  loadDeviceCrossFilter,
} from '../explorer-reference';
import { ProductionDeviceExplorerDataService } from '../../shared/services/production-device-explorer-data.service';
import { TransitionManageService } from '../../shared/services/transition.service';

import {
  selectDeviceExplorerData,
  mapDeviceData,
} from '../../shared/services/store/deviceexplorer/selectors';
import { AppService } from '../../shared/services/app.service';

@Component({
  selector: 'app-pathfinder-explorer',
  templateUrl: './pathfinder-explorer.component.html',
  styleUrls: ['./pathfinder-explorer.component.scss'],
})
export class PathfinderExplorerComponent implements OnDestroy, OnInit {
  data = [];
  cfData: DeviceCrossFilterData;
  dataSub_: Subscription;
  subscriptions_: Subscription[] = [];
  fileDownloadQueryString: string;
  constructor(
    public appService: AppService,
    public productionDeviceExplorerDataService: ProductionDeviceExplorerDataService,
    private transManageService: TransitionManageService,
    private store: Store
  ) {
    this.productionDeviceExplorerDataService.init();
    this.fileDownloadQueryString = this.onGetDownloadLink();
    this.dataSub_ = this.store
      .select(selectDeviceExplorerData)
      .pipe(map((data) => mapDeviceData(data)))
      .subscribe((newData) => {
        if (newData.range.maxDate) {
          this.productionDeviceExplorerDataService.onUpdateMinMax(
            moment(newData.range.minDate).clone(),
            moment(newData.range.maxDate).clone()
          );
        }
        this.appService.setLoading(false);
        this.data = newData.explorerData;
        this.load();
      });
  }

  load() {
    this.cfData = loadDeviceCrossFilter(
      this.data,
      (d) =>
        this.filter(d) &&
        moment(d.end).isSameOrAfter(this.productionDeviceExplorerDataService.startDate, 'day') &&
        moment(d.end).isSameOrBefore(this.productionDeviceExplorerDataService.endDate, 'day'),
      this.reduceAdd,
      this.reduceRemove,
      this.reduceOrder
    );
  }

  reduceAdd(p: number, v: IPathfinderExplorerData): number {
    p += v.goodParts;
    return p;
  }

  reduceRemove(p: number, v: IPathfinderExplorerData): number {
    p -= v.goodParts;
    return p;
  }

  filter(item: IPathfinderExplorerData) {
    return item.goodParts > 0;
  }

  reduceOrder(item: IPathfinderReducedData) {
    return item.goodParts;
  }

  update() {
    this.appService.setLoading(true);
    this.productionDeviceExplorerDataService.onDateRangeChange();
    if (
      this.productionDeviceExplorerDataService.startDate &&
      this.productionDeviceExplorerDataService.endDate
    ) {
      this.fileDownloadQueryString = this.onGetDownloadLink();
      this.cfData.update();
    }
  }

  resetAll() {
    this.cfData.resetAll();
  }

  onGetDownloadLink() {
    return `/api/productionexplorer/device/download?startDate=${this.productionDeviceExplorerDataService.startDate
      .toDate()
      .toISOString()}&endDate=${this.productionDeviceExplorerDataService.endDate
      .toDate()
      .toISOString()}`;
  }

  ngOnInit(): void {
    this.appService.setLoading(true);
    // this.transition$ = this.transManageService.transitionObs$.subscribe((transition) => {
    //   let transitionOptions: TransitionOptions = transition.options();
    //   if (transitionOptions.source === 'url') {
    //     this.productionDeviceExplorerDataService.onGetParamsFromUrl(transition.params());
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
    this.dataSub_.unsubscribe();
  }
}
