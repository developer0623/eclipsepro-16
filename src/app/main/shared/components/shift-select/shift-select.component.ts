import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { IShiftChoice } from 'src/app/core/dto';

@Component({
  selector: 'app-shift-select',
  templateUrl: './shift-select.component.html',
  styleUrls: ['./shift-select.component.scss'],
})
export class ShiftSelectComponent implements OnChanges {
  @Input() availableShifts: IShiftChoice[];
  @Input() shiftIndex: number;
  @Input() isDevice: boolean = false;
  @Output() updateShiftIndex = new EventEmitter<number>();
  @Output() updateShift = new EventEmitter<IShiftChoice>();

  currentIndex: number = 0;
  isFirst: boolean = true;
  isLast: boolean = true;
  shifts: (IShiftChoice & { isCurrent: boolean })[] = [undefined, undefined, undefined];
  currentShift: IShiftChoice;
  currentDate: Date;
  repeatShifts = [0, 1, 2];
  showShifts = false;

  refresh() {
    if (this.availableShifts && this.availableShifts.length > 0) {
      this.showShifts = this.availableShifts[0].shift > 0;
    }
    this.isFirst = this.currentIndex === 0;
    this.isLast = this.currentIndex === this.availableShifts.length - 1;

    this.currentShift = this.availableShifts[this.currentIndex];
    //console.log('122333', this.currentShift);
    //console.log('1223333, this.availableShifts', this.availableShifts);
    //console.log('1223333, this.currentIndex', this.currentIndex);
    if (this.currentShift) {
      this.currentDate = this.currentShift.shiftDate;
      let currentShiftCodeDate = this.currentShift.shiftCode.slice(0, -1);

      for (let i = 0; i < 3; i++) {
        let s = this.availableShifts.findIndex(
          (x) => x.shiftCode === currentShiftCodeDate + (i + 1)
        );
        if (s >= 0) {
          this.shifts[i] = {
            ...this.availableShifts[s],
            isCurrent: this.currentShift.shift === this.availableShifts[s].shift,
          };
        } else {
          this.shifts[i] = null;
        }
      }
    }
  }

  moveIndex(newIndex) {
    this.currentIndex = newIndex;
    this.onShiftIndexChange();
    this.refresh();
  }

  selectShift(shiftCode: string) {
    let s = this.availableShifts.findIndex((x) => x.shiftCode === shiftCode);
    this.currentIndex = s;
    this.onShiftIndexChange();
    this.refresh();
  }

  selectDate() {
    let d = moment(this.currentDate).format('YYYYMMDD');
    let s;
    if (this.isDevice) {
      s = this.availableShifts.findIndex((x) => x.shiftCode === d);
    } else {
      s = this.availableShifts.findIndex((x) => x.shiftCode.slice(0, -1) === d);
    }

    this.currentIndex = s;
    this.onShiftIndexChange();
    this.refresh();
  }

  onShiftIndexChange() {
    this.updateShiftIndex.emit(this.currentIndex);
    this.updateShift.emit(this.availableShifts[this.currentIndex]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('shift-select', changes);
    this.currentIndex = this.shiftIndex;
    this.refresh();
  }
}
