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
import { RowChart } from 'dc';
import * as dc from 'dc';
import { DimensionIData, GroupIData } from '../../explorer-reference';

@Component({
  selector: 'app-dc-pareto-chart',
  templateUrl: './dc-pareto-chart.component.html',
  styleUrls: ['./dc-pareto-chart.component.scss'],
})
export class DcParetoChartComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('paretochart', { static: true }) paretochart: ElementRef;
  @Input() dimension: DimensionIData;
  @Input() group: GroupIData;
  @Input() valueProperty = '';
  @Input() chartTitle = '';
  @Input() height = 100;
  @Input() topCount = 0;
  chart: RowChart;
  titleUnits = '';
  isFilterApplied = false;

  ngOnInit(): void {
    switch (this.valueProperty) {
      case 'durationMinutes':
      case 'allDownMinutes':
        this.titleUnits = ' minutes';
        break;
      case 'goodFt':
      case 'goodLocal':
      case 'scrapLengthFt':
      case 'scrapLengthLocal':
        this.titleUnits = ' feet'; // todo: localize
        break;
      case 'oeePercent':
      case 'targetPercent':
        this.titleUnits = ' %';
        break;
    }
    this.chart = dc.rowChart(this.paretochart.nativeElement);
    this.chart
      .width(this.paretochart.nativeElement.clientWidth)
      .height(this.height)
      .dimension(this.dimension)
      .group(this.group)
      .gap(2)
      .margins({
        top: 5,
        left: 10,
        right: 10,
        bottom: 20,
      })
      .elasticX(true)
      .ordinalColors(['#3182bd'])
      .label((d) => d.key)
      .ordering((d) => d * -1)
      .cap(this.topCount)
      .on('filtered', (chart, filter) => {
        this.isFilterApplied = !!filter;
      });
    this.chart.xAxis().tickFormat(d3.format('.2s'));
    this.chart.title(
      (t) => d3.format(',.0f')(((<unknown>t) as { key; value }).value) + this.titleUnits
    );
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
