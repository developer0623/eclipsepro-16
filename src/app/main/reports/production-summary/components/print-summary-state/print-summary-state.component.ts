import { Component, Input, OnInit } from '@angular/core';
import { IBulletChartModel, UnitOfMeasure } from 'src/app/core/dto';

@Component({
  selector: 'app-print-summary-state',
  templateUrl: './print-summary-state.component.html',
  styleUrls: ['./print-summary-state.component.scss'],
})
export class PrintSummaryStateComponent implements OnInit {
  @Input() data: IBulletChartModel<UnitOfMeasure>;
  @Input() state: boolean;
  percent = 0;
  startPos = '0%';
  endPos = '0%';

  ngOnInit() {
    this.percent = 100 / (this.data.maxValue - this.data.minValue);
    this.startPos = this.data.okRangeStart * this.percent + '%';
    this.endPos = (this.data.okRangeEnd - this.data.okRangeStart) * this.percent + '%';
  }

  getMainArea(order) {
    let mainStyle = {};
    switch (order) {
      case 0: {
        mainStyle['width'] = this.startPos;
        break;
      }
      case 1: {
        mainStyle['width'] = this.endPos;
        break;
      }
      default: {
        mainStyle['flex'] = 1;
        break;
      }
    }

    return mainStyle;
  }

  getTargetPos() {
    let pos = this.data.targetValue * this.percent + '%';
    return { left: pos };
  }

  getValueState() {
    if (this.data.value < this.data.okRangeStart) {
      return 0;
    }

    if (this.data.value < this.data.okRangeEnd) {
      return 1;
    }

    return 2;
  }

  getValueArea() {
    let width = this.data.value * this.percent;
    if (width > 100) {
      width = 100;
    }
    const state = this.getValueState();
    return { width: width + '%' };
  }

  getRangePos(order) {
    if (order) {
      return { left: `calc(${this.startPos} + ${this.endPos} - 25px)` };
    } else {
      return { left: `calc(${this.startPos} - 25px)` };
    }
  }
}
