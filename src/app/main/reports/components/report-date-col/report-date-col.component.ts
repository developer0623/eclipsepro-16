import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { DurationType } from '../../report-type';
import { initDate } from '../../common';

@Component({
  selector: 'app-report-date-col',
  templateUrl: './report-date-col.component.html',
  styleUrls: ['./report-date-col.component.scss'],
})
export class ReportDateColComponent implements OnChanges {
  @Input() startDate: moment.Moment;
  @Input() endDate: moment.Moment;
  @Input() duration: DurationType;
  @Output() onChange = new EventEmitter();
  calType = 'month';

  startMaxDate = moment().add(-1, 'd');
  endMaxDate = moment();

  compareDates(newDate, oldDate) {
    return moment(newDate).isAfter(oldDate);
  }

  onChangeStartDate() {
    this.endDate = this.compareDates(this.startDate, this.endDate) ? this.startDate : this.endDate;
    if (this.duration !== 'day') {
      const result = initDate(this.startDate, this.endDate, this.duration);
      this.startDate = result.startDate;
      this.endDate = result.endDate;
    }
    this.onChange.emit({ startDate: this.startDate, endDate: this.endDate });
  }

  onChangeEndDate() {
    this.startDate = this.compareDates(this.startDate, this.endDate)
      ? this.endDate
      : this.startDate;
    if (this.duration !== 'day') {
      const result = initDate(this.startDate, this.endDate, this.duration);
      this.startDate = result.startDate;
      this.endDate = result.endDate;
    }
    this.onChange.emit({ startDate: this.startDate, endDate: this.endDate });
  }

  // next and prev button
  onChangeDate(step) {
    const mStartDate = moment(this.startDate);
    const mEnddate = moment(this.endDate);
    if (this.duration === 'week') {
      this.startDate = mStartDate.add(step, 'w');
      this.endDate = mEnddate.add(step, 'w');
    } else if (this.duration === 'month') {
      this.startDate = mStartDate.add(step, 'M');
      this.endDate = mEnddate.add(step, 'M');
    } else {
      this.startDate = mStartDate.add(step, 'd');
      this.endDate = mEnddate.add(step, 'd');
    }
    this.onChange.emit({ startDate: this.startDate, endDate: this.endDate });
  }

  onlyAllowDate = (d: moment.Moment | null) => {
    const day = (d || moment()).weekday();
    if (this.duration === 'week') {
      return day === 0;
    }
    return true;
  };

  onlyAllowEndDate = (d: moment.Moment | null) => {
    const day = (d || moment()).weekday();
    if (this.duration === 'week') {
      return day === 6;
    }
    return true;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.duration) {
      const result = initDate(this.startDate, this.endDate, this.duration);
      this.startDate = result.startDate;
      this.endDate = result.endDate;
      this.calType = changes.duration.currentValue === 'year' ? 'year' : 'month';
    }
  }
}
