import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
import { IfpmPlan, IPerformanceData } from 'src/app/core/dto';

@Component({
  selector: 'app-performance-chart',
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.scss'],
})
export class PerformanceChartComponent implements OnChanges {
  @Input() value: IfpmPlan[];
  @ViewChild('performanceChart', { static: true }) performanceChart: ElementRef;
  valueline: d3.Line<IfpmPlan>;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  path: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
  mainChart: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  init() {
    if (this.performanceChart.nativeElement.width) {
      this.initChart();
    } else {
      setTimeout(() => {
        this.initChart();
      });
    }
  }

  initChart() {
    let chartEl = this.performanceChart.nativeElement;
    let margin = { top: 20, right: 20, bottom: 20, left: 40 };
    let width = chartEl.clientWidth - margin.left - margin.right;
    let height = chartEl.clientHeight - margin.top - margin.bottom;
    this.xScale = d3.scaleLinear().range([0, width]);
    this.yScale = d3.scaleLinear().range([height, 0]);
    let tickCount = this.value.length;
    let xAxis = d3.axisBottom(this.xScale).ticks(tickCount);
    let yAxis = d3.axisLeft(this.yScale).ticks(tickCount);

    this.valueline = d3
      .line<IfpmPlan>()
      .x((d) => this.xScale(d.lengthIn))
      .y((d) => this.yScale(d.fpm));

    this.svg = d3
      .select(chartEl)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    this.mainChart = this.svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.mainChart
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'arrow')
      .attr('refX', 6)
      .attr('refY', 6)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('orient', 'auto')
      .attr('viewBox', '0 0 12 12')
      .append('path')
      .attr('d', 'M2,1 L7,6 L2,11')
      .style('strokeWidth', 2);

    this.path = this.mainChart.append('path').attr('fill', 'none');

    this.drawChart();

    this.mainChart
      .append('g') // Add the X Axis
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    // Add the Y Axis
    this.mainChart
      .append('g') // Add the Y Axis
      .attr('class', 'y axis')
      .call(yAxis);
  }

  drawChart() {
    let lastItem = this.value[this.value.length - 1];
    let newItem = { lengthIn: lastItem.lengthIn + 10, fpm: lastItem.fpm };
    let graphData = this.value.concat(newItem);

    this.xScale.domain([0, newItem.lengthIn]);
    this.yScale.domain([0, d3.max(graphData, (d: IfpmPlan) => d.fpm)]);

    this.path.datum(graphData).attr('d', this.valueline).attr('marker-end', 'url(#arrow)');

    this.mainChart
      .selectAll('.dot')
      .data(this.value)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', (d: IfpmPlan) => this.xScale(d.lengthIn))
            .attr('cy', (d: IfpmPlan) => this.yScale(d.fpm))
            .attr('r', 3),
        (update) =>
          update
            .attr('cx', (d: IfpmPlan) => this.xScale(d.lengthIn))
            .attr('cy', (d: IfpmPlan) => this.yScale(d.fpm)),
        (exit) => exit.remove()
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.value && changes.value.currentValue) {
      if (!this.svg) {
        this.init();
      } else {
        this.drawChart();
      }
    }
  }
}
