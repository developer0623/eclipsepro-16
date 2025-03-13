import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { ITwoValuesModel, Percentage, Length } from 'src/app/core/dto';
import { ProductionSummaryService } from '../../../../shared/services/production-summary.service';

@Component({
  selector: 'app-summary-history',
  templateUrl: './summary-history.component.html',
  styleUrls: ['./summary-history.component.scss'],
})
export class SummaryHistoryComponent implements OnInit {
  @Input() data: ITwoValuesModel<Percentage, Length>;
  @Input() state;
  @ViewChild('historySvg', { static: true }) historySvg: ElementRef;
  valueBgCol = ['#c1272d', '#4d4d4d', '#2f7852'];

  constructor(private productionSummaryService: ProductionSummaryService) {}

  getValueState() {
    // REFACTOR: This component should not rely on the existence of bullet data. The "ValueState"
    // should be passed in via a binding.
    if (this.data.bullet) {
      if (this.data.bullet.value < this.data.bullet.okRangeStart) {
        return 0;
      }

      if (this.data.bullet.value < this.data.bullet.okRangeEnd) {
        return 1;
      }
      return 2;
    }
    return 1;
  }

  getMarkerColor() {
    const state = this.getValueState();
    let bgCol = '';
    if (this.state) {
      bgCol = this.valueBgCol[2 - state];
    } else {
      bgCol = this.valueBgCol[state];
    }

    return bgCol;
  }

  drawGraph() {
    let chartEl = this.historySvg.nativeElement;
    let margin = { top: 5, right: 5, bottom: 7, left: 5 };
    let width = chartEl.clientWidth - margin.left - margin.right;
    let height = chartEl.clientHeight - margin.top - margin.bottom;

    let hisLength = this.data.history.length;

    let x = d3
      .scaleLinear()
      .domain([0, hisLength - 1])
      .range([0, width]);
    let y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(this.data.history, (d) => d.value)]);

    let valueline = d3
      .line()
      .x((d, i) => x(i))
      .y((d: any) => y(d.value))
      .curve(d3.curveNatural);

    let svg = d3
      .select(chartEl)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const markerCol = this.getMarkerColor();

    let markgerId = `circle${this.productionSummaryService.markerId}`;
    this.productionSummaryService.markerId++;
    svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', markgerId)
      .attr('refX', 6)
      .attr('refY', 6)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .attr('viewBox', '0 0 12 12')
      .append('circle')
      .attr('cx', 6)
      .attr('cy', 6)
      .attr('r', 3)
      .attr('fill', markerCol);

    svg
      .append('path') // Add the valueline path.
      .attr('class', 'line')
      .attr('d', valueline(this.data.history as any[]))
      .attr('marker-end', `url(#${markgerId})`);
  }

  ngOnInit() {
    if (this.data.history) {
      this.drawGraph();
    }
  }
}
