import { Injectable, Inject } from '@angular/core';
import * as moment from 'moment';
import { Transition, StateService } from '@uirouter/core';
import { Store } from '@ngrx/store';

import {
  initDeviceExplorerDataAction,
  setDeviceExplorerDataCurrentRangeAction,
} from './store/deviceexplorer/actions';

@Injectable({
  providedIn: 'root',
})
export class ProductionDeviceExplorerDataService {
  startDate: moment.Moment = moment().add(-17, 'days');
  endDate: moment.Moment = moment();
  minDate: moment.Moment = moment().add(-1, 'months');
  maxDate: moment.Moment = moment();

  constructor(private store: Store, private state: StateService) {}

  init(tran: Transition) {
    const queryString = tran.params();
    if (queryString.startDate) {
      const m = moment(queryString.startDate);
      if (m.isValid()) this.startDate = m;
    }
    if (queryString.endDate) {
      const m = moment(queryString.endDate);
      if (m.isValid()) this.endDate = m;
    }

    this.store.dispatch(
      initDeviceExplorerDataAction({
        payload: {
          startDate: this.startDate.toDate(),
          endDate: this.endDate.toDate(),
        },
      })
    );
  }

  onUpdateMinMax(min, end) {
    if (Math.abs(end.diff(this.maxDate, 'days')) > 0) {
      const diff = end.diff(min, 'days');
      this.endDate = end;
      if (diff > 30) {
        this.startDate = this.endDate.clone().add(-1, 'months');
      } else {
        this.startDate = min.clone();
      }

      this.minDate = min;
      this.maxDate = end;
      this.updateQueryString();
      this.store.dispatch(
        setDeviceExplorerDataCurrentRangeAction({
          payload: {
            startDate: this.startDate.toDate(),
            endDate: this.endDate.toDate(),
          },
        })
      );
    }
  }

  onDateRangeChange() {
    if (this.startDate && this.endDate) {
      this.updateQueryString();
      this.store.dispatch(
        setDeviceExplorerDataCurrentRangeAction({
          payload: {
            startDate: this.startDate.toDate(),
            endDate: this.endDate.toDate(),
          },
        })
      );
    }
  }

  updateQueryString() {
    const exportQuery = {
      startDate: this.startDate.format('YYYY-MM-DD'),
      endDate: this.endDate.format('YYYY-MM-DD'),
    };

    this.state.go('.', exportQuery, { notify: false });
  }

  onGetParamsFromUrl(queryString) {
    if (queryString.startDate) {
      const m = moment(queryString.startDate);
      if (m.isValid()) this.startDate = m;
    }
    if (queryString.endDate) {
      const m = moment(queryString.endDate);
      if (m.isValid()) this.endDate = m;
    }

    this.store.dispatch(
      setDeviceExplorerDataCurrentRangeAction({
        payload: {
          startDate: this.startDate.toDate(),
          endDate: this.endDate.toDate(),
        },
      })
    );
  }
}
