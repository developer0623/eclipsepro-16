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
  selector: 'app-dc-time-bar-chart',
  templateUrl: './dc-time-bar-chart.component.html',
  styleUrls: ['./dc-time-bar-chart.component.scss'],
})
export class DcTimeBarChartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('barchart', { static: true }) barchart: ElementRef;
  @Input() dimension: DimensionIData;
  @Input() group: GroupIData;
  @Input() valueProperty = '';
  @Input() chartTitle = '';
  @Input() height = 100;
  chart: BarChart;
  isFilterApplied = false;
  filteredXValue = [];

  ngOnInit(): void {
    this.chart = dc.barChart(this.barchart.nativeElement);
    this.chart
      .width(this.barchart.nativeElement.clientWidth)
      .height(this.height)
      .x(d3.scaleTime().domain([new Date(2007, 4, 3), new Date(2007, 11, 19)]))
      .xUnits(d3.timeDays)
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
      .elasticX(true)
      .elasticY(true)
      .centerBar(true)
      .xAxisPadding(1)
      .on('filtered', (chart, filter) => {
        this.isFilterApplied = !!filter;
        this.filteredXValue = filter || [];
      });

    this.chart.yAxis().tickFormat(d3.format('.2s'));
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
