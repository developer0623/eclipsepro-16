import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { tickFormat } from 'd3';
import * as moment from 'moment';
import { IRollformingStatistics } from 'src/app/core/dto';
declare let d3: any;

interface DataType {
  key: string;
  values: { x: string; y: number }[];
  color: string;
}

@Component({
  selector: 'app-shift-history-chart',
  templateUrl: './shift-history-chart.component.html',
  styleUrls: ['./shift-history-chart.component.scss'],
})
export class ShiftHistoryChartComponent implements OnInit, OnChanges {
  @Input() shifts: IRollformingStatistics[];
  @Input() scale = '';
  data: DataType[] = [];
  options = {
    chart: {
      type: 'multiBarChart',
      transitionDuration: 0,
      height: 250,
      width: null,
      margin: {
        top: 20,
        right: 20,
        bottom: 45,
        left: 45,
      },
      clipEdge: true,
      stacked: true,
      showControls: false,
      xAxis: {
        axisLabel: 'Shifts',
        showMaxMin: false,
        tickFormat: (shiftcode: string) => {
          let d = moment(shiftcode.slice(0, 8), 'YYYYMMDD');
          return d.format('MM/DD') + ':' + shiftcode.slice(8);
        },
      },
      yAxis: {
        axisLabel: this.scale === 'pct' ? '' : 'Minutes',
        axisLabelDistance: -20,
        showMaxMin: false,
        tickFormat: (d) => {
          return d3.format(',f')(d);
        },
      },
    },
    config: {
      deepWatchData: true,
    },
  };

  toggleScale() {
    this.scale = this.scale === 'pct' ? 'min' : 'pct';
    this.calculateChartVM();
  }

  calculateChartVM() {
    let sortedShifts = this.shifts
      .filter((s) => s.totalMinutes > 5)
      .sort((s1, s2) => {
        if (s1.startShiftCode > s2.startShiftCode) return 1;
        if (s1.startShiftCode < s2.startShiftCode) return -1;
        return 0;
      });
    let run = sortedShifts.map((shift) => {
      return {
        x: shift.startShiftCode,
        y: this.scale === 'pct' ? shift.runPct * 100 : shift.runMinutes,
      };
    });
    let exempt = sortedShifts.map((shift) => {
      return {
        x: shift.startShiftCode,
        y: this.scale === 'pct' ? shift.exemptPct * 100 : shift.exemptMinutes,
      };
    });
    let nonExempt = sortedShifts.map((shift) => {
      return {
        x: shift.startShiftCode,
        y: this.scale === 'pct' ? shift.nonExemptPct * 100 : shift.nonExemptMinutes,
      };
    });

    this.data = [
      { key: 'Run', values: run, color: '#4caf50' },
      { key: 'Unscheduled', values: exempt, color: '#ffb03b' },
      { key: 'Downtime', values: nonExempt, color: '#f44336' },
    ];

    this.options.chart.yAxis.axisLabel = this.scale === 'pct' ? 'Percent' : 'Minutes';
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.shifts && changes.shifts.currentValue) {
      this.calculateChartVM();
    }
  }
}
