import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import * as d3 from 'd3';
import { BarChart } from 'dc';
import * as dc from 'dc';
import { DimensionIData, GroupIData } from '../../explorer-reference';

@Component({
  selector: 'app-dc-linear-bar-chart',
  templateUrl: './dc-linear-bar-chart.component.html',
  styleUrls: ['./dc-linear-bar-chart.component.scss'],
})
export class DcLinearBarChartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('linearchart', { static: true }) linearchart: ElementRef;
  @Input() dimension: DimensionIData;
  @Input() group: GroupIData;
  @Input() valueProperty = '';
  @Input() groupProperty = '';
  @Input() chartTitle = '';
  @Input() height = 100;
  chart: BarChart;
  isFilterApplied = false;

  onGetX() {
    if (this.groupProperty === 'dayOfWeek') {
      return d3.scaleLinear().domain([-0.5, 6.5]);
    } else if (this.groupProperty === 'hourOfDay') {
      return d3.scaleLinear().domain([-0.5, 23.5]);
    } else if (this.dimension.top(1).length > 0) {
      return d3.scaleLinear().domain([0, this.dimension.top(1)[0][this.groupProperty]]);
    } else {
      return d3.scaleLinear().domain([0, 60]);
    }
  }

  ngOnInit(): void {
    this.chart = dc.barChart(this.linearchart.nativeElement);
    this.chart
      .width(this.linearchart.nativeElement.clientWidth)
      .height(this.height)
      .x(this.onGetX())
      .brushOn(true)
      .dimension(this.dimension)
      .group(this.group)
      .gap(1)
      .margins({
        top: 10,
        right: 10,
        bottom: 20,
        left: 40,
      })
      .elasticY(true)
      .centerBar(this.groupProperty === 'dayOfWeek' || this.groupProperty === 'hourOfDay')
      .on('filtered', (chart, filter) => {
        this.isFilterApplied = !!filter;
      });

    this.chart.yAxis().tickFormat(d3.format('.2s'));
    if (this.groupProperty === 'dayOfWeek') {
      this.chart
        .xAxis()
        .ticks(7)
        .tickFormat((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]);
    }
  }

  ngAfterViewInit() {
    // Render the DC.js chart
    dc.renderAll();
  }

  resetFilters() {
    this.chart.filterAll();
    dc.redrawAll();
    this.isFilterApplied = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      this.chart.dimension(this.dimension).group(this.group);
      dc.redrawAll();
    }
  }
}
