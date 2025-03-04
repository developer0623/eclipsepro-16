import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from '../../services/event.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-timeline-xaxis',
  templateUrl: './timeline-xaxis.component.html',
  styleUrls: ['./timeline-xaxis.component.scss'],
})
export class TimelineXAxisComponent implements OnInit, OnChanges, OnDestroy {
  @Input() displayXDomain: Date[];
  @Input() height = 100;
  @Input() width = 0;
  @Input() cursorTime: Date;
  @ViewChild('timelineSvg', { static: true }) timelineSvg: ElementRef;
  private eventSubscription: Subscription;
  paddingTop: number = 0;
  paddingRight: number = 0;
  paddingBottom: number = 40;
  paddingLeft: number = 0;
  scaleWidth: number = 0;
  scaleHeight: number = 0;
  xValDomain: Date[] = [];
  xScale: d3.ScaleTime<number, number, never>;
  xAxis: d3.Axis<d3.AxisDomain>;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  gChart: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  gxAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  gMain: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  gCursor: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;

  constructor(private elementRef: ElementRef, private eventService: EventService) {}

  multiFormat(date) {
    const formatMillisecond = d3.timeFormat('.%L'),
      formatSecond = d3.timeFormat(':%S'),
      formatMinute = d3.timeFormat('%I:%M'),
      formatHour = d3.timeFormat('%I %p'),
      formatDay = d3.timeFormat('%a %d'),
      formatWeek = d3.timeFormat('%b %d'),
      formatMonth = d3.timeFormat('%B'),
      formatYear = d3.timeFormat('%Y');
    return (
      d3.timeSecond(date) < date
        ? formatMillisecond
        : d3.timeMinute(date) < date
        ? formatSecond
        : d3.timeHour(date) < date
        ? formatMinute
        : d3.timeDay(date) < date
        ? formatHour
        : d3.timeMonth(date) < date
        ? d3.timeWeek(date) < date
          ? formatDay
          : formatWeek
        : d3.timeYear(date) < date
        ? formatMonth
        : formatYear
    )(date);
  }

  ngOnInit() {
    const svgElement = this.timelineSvg.nativeElement;
    this.width = this.width || svgElement.clientWidth;
    this.scaleWidth = this.width - this.paddingLeft - this.paddingRight;
    this.scaleHeight = this.height - this.paddingTop - this.paddingBottom;
    this.xValDomain = this.displayXDomain;
    this.xScale = d3.scaleTime().range([0, this.scaleWidth]).domain(this.xValDomain);

    this.xAxis = d3.axisBottom(this.xScale).tickFormat(this.multiFormat);

    this.svg = d3
      .select(svgElement)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('font-size', '10');

    this.svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.scaleWidth)
      .attr('height', '100%');

    this.gChart = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.paddingLeft + ',' + this.paddingTop + ')')
      .attr('width', this.scaleWidth)
      .attr('height', this.scaleHeight)
      .attr('clip', 'url(#clip)');

    this.gxAxis = this.gChart
      .append('g')
      .attr('class', 'xAxis')
      .attr('transform', 'translate(0,' + this.scaleHeight + ')');

    this.gMain = this.gChart.append('g').attr('class', 'main').attr('height', this.scaleHeight);

    this.gCursor = this.gMain
      .append('g')
      .attr('class', 'cursor')
      .append('line')
      .attr('y1', 0.0)
      .attr('y2', this.height);

    this.draw();
    this.eventSubscription = this.eventService.getEvent().subscribe((event) => {
      this.xValDomain = event.domain;
      this.xScale.domain(this.xValDomain);
      this.draw();
    });
  }

  drawCursor() {
    const x = this.xScale(this.cursorTime);

    this.gCursor.attr('x1', x);
    this.gCursor.attr('x2', x);
  }

  advanceCursorTime() {
    this.cursorTime = new Date();
    this.draw();
  }

  draw() {
    if (!this.xScale || !this.xAxis) {
      return;
    }
    this.drawCursor();
    this.xAxis.scale(this.xScale);
    this.gxAxis.call(this.xAxis);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.draw();
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
