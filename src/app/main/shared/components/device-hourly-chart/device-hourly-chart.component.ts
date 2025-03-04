import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { tickFormat } from 'd3';
import * as moment from 'moment';
import { IDevice, IDeviceShiftStatistics, IRollformingStatistics } from 'src/app/core/dto';
declare let d3: any;

interface DataType {
  key: string;
  values: { x: number; y: number }[];
  color: string;
}

@Component({
  selector: 'app-device-hourly-chart',
  templateUrl: './device-hourly-chart.component.html',
  styleUrls: ['./device-hourly-chart.component.scss'],
})
export class DeviceHourlyChartComponent implements OnInit, OnChanges {
  @Input() deviceStats: IDeviceShiftStatistics;
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
        axisLabel: 'Hours',
        showMaxMin: false,
        tickFormat: (d) => {
          return d3.format(',f')(d);
        },
      },
      yAxis: {
        axisLabel: 'Operations',
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
  allHours: number[] = [];

  calculateChartVM() {
    let ops = this.allHours.map((h) => {
      return {
        x: h,
        y: this.deviceStats.byHour.find((x) => x.hour === h)?.totalOperations ?? 0,
      };
    });

    this.data = [{ key: 'Operations', values: ops, color: '#3fa9f5' }];
  }

  ngOnInit(): void {
    for (let i = 0; i <= 23; i++) {
      this.allHours.push(i);
    }
    if (this.deviceStats) {
      this.calculateChartVM();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deviceStats && changes.deviceStats.currentValue) {
      this.calculateChartVM();
    }
  }
}
