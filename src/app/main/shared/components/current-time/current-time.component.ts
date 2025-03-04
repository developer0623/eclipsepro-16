import { Component, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import { SystemInfoService } from '../../services/system-info.service';

@Component({
  selector: 'app-current-time',
  templateUrl: './current-time.component.html',
  styleUrls: ['./current-time.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CurrentTimeComponent implements OnDestroy {
  private timeTicker: Subscription;
  public time: any = {
    now: {
      second: '',
      minute: '',
      hour: '',
      day: '',
      month: '',
      year: '',
    },
    ticker: () => {
      const now = moment().add(this.systemInfoService.systemInfo.serverTimeOffsetSeconds, 's');
      const nowServer = now.clone();
      this.time.now = {
        meridiem: nowServer.format('a'),
        second: nowServer.format('ss'),
        minute: nowServer.format('mm'),
        hour: nowServer.format('hh'),
      };
    },
  };

  constructor(private systemInfoService: SystemInfoService) {
    this.timeTicker = interval(1000)
      .pipe(takeWhile(() => true))
      .subscribe(() => this.time.ticker());
  }

  ngOnDestroy() {
    this.timeTicker.unsubscribe();
  }
}
