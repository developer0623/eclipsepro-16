import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Transition, StateService, TransitionOptions } from '@uirouter/core';
import { Store } from '@ngrx/store';
import {
  InitExplorerData,
  SetExplorerDataCurrentRange,
} from 'src/app/core/services/store/productionexplorer/actions';
import {
  initExplorerDataAction,
  setExplorerDataCurrentRangeAction,
} from './store/productionexplorer/actions';

@Injectable({
  providedIn: 'root',
})
export class ProductionExplorerDataService {
  startDate: moment.Moment = moment().add(-1, 'weeks');
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
    } else {
      this.updateQueryString();
    }

    this.store.dispatch(
      initExplorerDataAction({
        payload: {
          startDate: this.startDate.toDate(),
          endDate: this.endDate.toDate(),
        },
      })
    );
  }

  onUpdateMinMax(min, end) {
    this.minDate = min;
    this.maxDate = end;
  }

  onDateRangeChange() {
    if (this.startDate && this.endDate) {
      this.updateQueryString();
      this.store.dispatch(
        setExplorerDataCurrentRangeAction({
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
      setExplorerDataCurrentRangeAction({
        payload: {
          startDate: this.startDate.toDate(),
          endDate: this.endDate.toDate(),
        },
      })
    );
  }
}
