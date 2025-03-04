import {
  Component,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnInit,
  OnChanges,
  Inject,
} from '@angular/core';
import * as d3 from 'd3';
import {
  IRunblockData,
  IRunblockItem,
  IRunblockMachineEvent,
  IRunblockScheduledDowntime,
} from 'src/app/core/dto';
import { UnitsService } from '../../services/units.service';

@Component({
  selector: 'app-runblocks-chart',
  templateUrl: './runblocks-chart.component.html',
  styleUrls: ['./runblocks-chart.component.scss'],
})
export class RunblocksChartComponent implements OnChanges, OnInit {
  @Input() data: IRunblockData;
  @Input() metric: string;
  @Input() machineType: string;
  @ViewChild('runblockSvg', { static: true }) runblockSvg: ElementRef;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  scatter: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  width = 0;
  height = 300;
  fixedHeight: number = -20;
  margin = { top: 30, right: 30, bottom: 70, left: 70 };
  xScale: d3.ScaleLinear<number, number, never>;
  orginxScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  xAxis: d3.Axis<d3.AxisDomain>;
  yAxis: d3.Axis<d3.AxisDomain>;
  xValues: number[] = [];
  xPos: number[] = [];
  xAxisbar: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  yAxisbar: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  eventsTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  transform: d3.ZoomTransform;
  minXTime;

  constructor(public unitsService: UnitsService) {}

  onGetMinmax() {
    let minYRange: number = d3.min(this.data.runBlocks, (d: IRunblockItem) => d[this.metric]) ?? 0;
    minYRange = minYRange > this.fixedHeight ? this.fixedHeight : minYRange;
    let maxYRange: number = d3.max(this.data.runBlocks, (d: IRunblockItem) => d[this.metric]) ?? 0;
    this.data.runBlocks.map((item) => (item.durationMinutes = item.durationMinutes));
    let maxXRange: number = this.data.runBlocks.reduce((acc: number, curr: IRunblockItem) => {
      return acc + curr.durationMinutes;
    }, 0);
    this.minXTime = this.data.runBlocks[0]?.startTime;
    this.xValues = [0, ...this.data.runBlocks.map((datum: IRunblockItem) => datum.durationMinutes)];
    this.xValues = this.xValues.map((_value, index) =>
      this.xValues.slice(0, index + 1).reduce((a, b) => a + b)
    );
    return { minYRange, maxYRange, maxXRange, minXTime: this.minXTime };
  }

  drawChart() {
    const svgElement = this.runblockSvg.nativeElement;
    this.width = this.width || svgElement.clientWidth;
    const extent: [[number, number], [number, number]] = [
      [this.margin.left, this.margin.top],
      [this.width - this.margin.right, this.height - this.margin.top],
    ];
    let zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent(extent)
      .extent(extent)
      .on('zoom', (e) => this.zoomed(e));
    this.svg = d3
      .select(svgElement)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('style', 'max-width: 100%; height: auto;')
      .call(zoom);

    const { minYRange, maxYRange, maxXRange, minXTime } = this.onGetMinmax();

    // Define scales
    this.xScale = d3
      .scaleLinear()
      .domain([0, maxXRange])
      .range([this.margin.left, this.width - this.margin.right])
      .nice();
    this.orginxScale = this.xScale;

    this.yScale = d3
      .scaleLinear()
      .domain([minYRange ?? this.fixedHeight, maxYRange ?? 0])
      .range([this.height - this.margin.bottom, this.margin.top])
      .nice();

    this.xAxis = d3
      .axisBottom(this.xScale)
      .ticks(15)
      .tickFormat((d) => {
        let tm = new Date(new Date(minXTime).getTime() + Number(d) * 60000);
        return (
          tm.getHours() + ':' + tm.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 })
        );
      });
    this.yAxis = d3.axisLeft(this.yScale).tickFormat((d) => {
      if (Number(d) < 0) return '';
      return d.toString();
    });

    // Add a clipPath: everything out of this area won't be drawn.
    this.svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'runblock-clip')
      .append('rect')
      .attr('width', this.width - this.margin.left)
      .attr('height', this.height)
      .attr('x', this.margin.left)
      .attr('y', 0);

    // Create the scatter variable: where both the circles and the brush take place
    this.scatter = this.svg.append('g').attr('clip-path', 'url(#runblock-clip)');

    // Create a tooltip element
    this.tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '2px solid #676767')
      .style('border-radius', '5px')
      .style('padding', '5px')
      .style('z-index', '10')
      .style('visibility', 'hidden');

    this.eventsTooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', '#2f3033')
      .style('color', '#f2f0f4')
      .style('border-radius', '5px')
      .style('padding', '4px 8px')
      .style('z-index', '10')
      .style('visibility', 'hidden');

    this.mainDrawChart();

    // append the x axis
    this.xAxisbar = this.scatter
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
      .call(this.xAxis);
    this.xAxisbar.selectAll('text').style('text-anchor', 'middle');

    // append the y axis
    this.yAxisbar = this.svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.margin.left - 1},0)`)
      .call(this.yAxis);

    // add the x axis label
    this.svg
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', this.margin.left)
      .attr('y', 0)
      .attr('dy', '1em')
      .attr('dx', '-4em')
      .text(this.metric === 'feetPerMinute' ? 'FPM' : 'Ops/Hour');

    // add the y axis label
    this.svg
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', this.width - this.margin.right)
      .attr('y', this.height - this.margin.bottom / 2)
      .attr('dy', '.5em')
      .attr('dx', '-2em')
      .text('Time');
  }

  updateChart() {
    const { minYRange, maxYRange, maxXRange, minXTime } = this.onGetMinmax();
    this.orginxScale.domain([0, maxXRange]);
    this.xScale.domain([0, maxXRange]);

    const nx = this.transform ? this.transform.rescaleX(this.xScale) : this.xScale;
    this.xAxis = d3
      .axisBottom(nx)
      .ticks(15)
      .tickFormat((d) => {
        let tm = new Date(new Date(minXTime).getTime() + Number(d) * 60000);
        return (
          tm.getHours() + ':' + tm.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 })
        );
      });

    this.yScale.domain([minYRange ?? this.fixedHeight, maxYRange ?? 0]);

    this.yAxis = d3.axisLeft(this.yScale).tickFormat((d) => {
      if (Number(d) < 0) return '';
      return d.toString();
    });
    this.xAxisbar
      .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
      .call(this.xAxis);
    this.yAxisbar.call(this.yAxis);

    this.mainDrawChart();
  }

  mainDrawChart() {
    // Runblocks
    this.scatter
      .selectAll('.bar')
      .data(this.data.runBlocks)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d: IRunblockItem, i: number) => {
              return this.orginxScale(this.xValues[i]);
            })
            .attr('y', (d: IRunblockItem) => {
              return d[this.metric] >= 0 ? this.yScale(d[this.metric]) : this.yScale(0);
            })
            .attr('width', (d: IRunblockItem, i: number) => {
              return this.orginxScale(d.durationMinutes) - this.margin.left;
            })
            .attr('transform', () => {
              if (!this.transform) {
                return 'translate(0,0)scale(1,1)';
              }
              return 'translate(' + this.transform.x + ',0)scale(' + this.transform.k + ',1)';
            })
            .attr('height', (d: IRunblockItem) => {
              let fixedHeight;
              if (d.machineStatus == 'R') fixedHeight = d[this.metric];
              else fixedHeight = -10;

              return Math.abs(this.yScale(0) - this.yScale(fixedHeight));
            })
            .attr('fill', (d: IRunblockItem, i: number) => {
              return this.mapBlockColor(d);
            })
            .on('mouseover', (e, d: IRunblockItem) => {
              this.tooltip
                .transition()
                .duration(200)
                .style('opacity', 1)
                .style('z-index', 1)
                .style('display', 'block');
              this.tooltip.html(() => this.mapTooltip(d));
              return this.tooltip.style('visibility', 'visible');
            })
            .on('mousemove', (e) => {
              const w = parseInt(this.tooltip.style('width'));
              //let x = window.innerWidth - e.pageX > 200 ? e.pageX + 20 : e.pageX - w - 210;
              let x = window.innerWidth - e.pageX > 200 ? e.pageX + 20 : e.pageX - w - 20;
              return this.tooltip
                .style('bottom', window.innerHeight - e.pageY + 'px')
                .style('left', x + 'px')
                .style('max-width', '200px');
            })
            // todo: the tooltip sometimes stays visible after mouseout
            .on('mouseout', (e) => {
              return this.tooltip.style('visibility', 'hidden');
            }),
        (update) =>
          update
            .attr('x', (d: IRunblockItem, i: number) => {
              return this.orginxScale(this.xValues[i]);
            })
            .attr('y', (d: IRunblockItem) => {
              return d[this.metric] >= 0 ? this.yScale(d[this.metric]) : this.yScale(0);
            })
            .attr('width', (d: IRunblockItem, i: number) => {
              return this.orginxScale(d.durationMinutes) - this.margin.left;
            })
            .attr('height', (d: IRunblockItem) => {
              let fixedHeight;
              if (d.machineStatus == 'R') fixedHeight = d[this.metric];
              else fixedHeight = -10;

              return Math.abs(this.yScale(0) - this.yScale(fixedHeight));
            })
            .attr('fill', (d: IRunblockItem, i: number) => {
              return this.mapBlockColor(d);
            }),
        (exit) => exit.remove()
      );

    // Scheduled Downtimes
    if (this.data.scheduledDowntimes) {
      this.scatter
        .selectAll('.sc-bar')
        .data(this.data.scheduledDowntimes)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('class', 'sc-bar')
              .attr('x', (d: IRunblockScheduledDowntime, i: number) => {
                const diffTime =
                  new Date(d.startTime).getTime() - new Date(this.minXTime).getTime();
                return this.orginxScale(diffTime / 60000);
              })
              .attr('y', (d: IRunblockScheduledDowntime) => this.yScale(-10))
              .attr('width', (d: IRunblockScheduledDowntime, i: number) => {
                return this.orginxScale(d.durationMinutes) - this.margin.left;
              })
              .attr('height', (d: IRunblockScheduledDowntime) =>
                Math.abs(this.yScale(0) - this.yScale(-10))
              )
              .attr('fill', (d: IRunblockScheduledDowntime, i: number) => {
                return this.mapScheduleDowntimeColor(d);
              })
              .on('mouseover', (e, d: IRunblockScheduledDowntime) => {
                this.tooltip
                  .transition()
                  .duration(200)
                  .style('opacity', 1)
                  .style('z-index', 1)
                  .style('display', 'block');
                this.tooltip.html(
                  () => `
                Scheduled Downtime <br/ >
                ${d.title}<br />
                Duration: ${d.durationMinutes.toFixed(2)} min`
                );
                return this.tooltip.style('visibility', 'visible');
              })
              .on('mousemove', (e) => {
                const w = parseInt(this.tooltip.style('width'));
                //let x = window.innerWidth - e.pageX > 200 ? e.pageX + 20 : e.pageX - w - 210;
                let x = window.innerWidth - e.pageX > 200 ? e.pageX + 20 : e.pageX - w - 20;
                return this.tooltip
                  .style('bottom', window.innerHeight - e.pageY + 'px')
                  .style('left', x + 'px')
                  .style('max-width', '200px');
              })
              // todo: the tooltip sometimes stays visible after mouseout
              .on('mouseout', (e) => {
                return this.tooltip.style('visibility', 'hidden');
              }),
          (update) =>
            update
              .attr('x', (d: IRunblockScheduledDowntime, i: number) => {
                const diffTime =
                  new Date(d.startTime).getTime() - new Date(this.minXTime).getTime();
                return this.orginxScale(diffTime / 60000);
              })
              .attr('y', (d: IRunblockScheduledDowntime) => this.yScale(-10))
              .attr('height', (d: IRunblockScheduledDowntime) =>
                Math.abs(this.yScale(0) - this.yScale(-10))
              )
              .attr('width', (d: IRunblockScheduledDowntime, i: number) => {
                return this.orginxScale(d.durationMinutes) - this.margin.left;
              })
              .attr('fill', (d: IRunblockScheduledDowntime, i: number) => {
                return this.mapScheduleDowntimeColor(d);
              }),
          (exit) => exit.remove()
        );
    }

    // Machine Events
    if (this.data.machineEvents) {
      this.scatter
        .selectAll('.symbol')
        .data(this.data.machineEvents)
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'symbol')
              .attr(
                'd',
                d3
                  .symbol()
                  .size(100)
                  .type((d: IRunblockMachineEvent) => {
                    switch (d.type) {
                      case 'CoilLoad':
                        return d3.symbolTriangle;
                      case 'Error':
                        return d3.symbolStar;
                      case 'Setup':
                        return d3.symbolCross;
                      default:
                        return d3.symbolCircle;
                    }
                  })
              )
              .attr('transform', (d: IRunblockMachineEvent, i: number) => {
                const diffTime =
                  new Date(d.recordDate).getTime() - new Date(this.minXTime).getTime();
                const nx = this.transform ? this.transform.rescaleX(this.xScale) : this.xScale;
                return 'translate(' + nx(diffTime / 60000) + ', ' + this.yScale(0) + ')scale(1,1)';
              })
              .on('mouseover', (e, d: IRunblockMachineEvent) => {
                this.eventsTooltip
                  .transition()
                  .duration(200)
                  .style('opacity', 1)
                  .style('z-index', 1)
                  .style('display', 'block');
                this.eventsTooltip.html(
                  () => `
              ${d.type}<br />
              ${d.description}`
                );
                return this.eventsTooltip.style('visibility', 'visible');
              })
              .on('mousemove', (e) => {
                const w = parseInt(this.eventsTooltip.style('width'));
                let x = window.innerWidth - e.pageX > 200 ? e.pageX + 20 : e.pageX - w - 20;
                return this.eventsTooltip
                  .style('bottom', window.innerHeight - e.pageY + 'px')
                  .style('left', x + 'px')
                  .style('max-width', '200px');
              })
              // todo: the tooltip sometimes stays visible after mouseout
              .on('mouseout', (e) => {
                return this.eventsTooltip.style('visibility', 'hidden');
              }),
          (update) =>
            update.attr('transform', (d: IRunblockMachineEvent, i: number) => {
              const diffTime = new Date(d.recordDate).getTime() - new Date(this.minXTime).getTime();
              const nx = this.transform ? this.transform.rescaleX(this.xScale) : this.xScale;
              return 'translate(' + nx(diffTime / 60000) + ', ' + this.yScale(0) + ')scale(1,1)';
            }),
          (exit) => exit.remove()
        );
    }
  }

  private mapBlockColor(d: IRunblockItem) {
    //todo: these colors should be shared with the snapshot-bar
    let color = 'lightgrey';
    if (d.machineStatus == 'R') color = '#4caf50';
    else if (d.codeValue === 0)
      // short stops: maybe add some red if longer than 10 minutes?
      color = 'lightgrey';
    else if (d.codeExempt == 'E') color = '#ffb03b';
    else if (d.codeExempt == 'N') color = '#f44336';
    return color;
  }

  private mapScheduleDowntimeColor(d: IRunblockScheduledDowntime) {
    switch (d.activityType) {
      case 'Unscheduled':
        return '#FFB03B';
      case 'Break':
        return '#0071B5';
      case 'Meeting':
        return '#11897D';
      case 'CoilChange':
        return '#F2D20C';
      case 'Maintenance':
        return '#74592E';
      case 'Breakdown':
        return '#942015';
      default:
        return '#000000';
    }
  }

  private mapTooltip(d) {
    switch (this.machineType) {
      case 'xl':
        if (d.machineStatus == 'R') {
          return `
      Order: ${d.orderCode}<br />
      Customer: ${d.customerName}<br />
      Produced: ${this.unitsService.convertUnits(
        d.producedLengthIn / 12,
        'ft',
        0
      )} ${this.unitsService.getUserUnits('ft')}<br />
      Duration: ${d.durationMinutes.toFixed(2)} min`;
        } else {
          return `
        Delay: ${d.codeDescription}<br />
        Duration: ${d.durationMinutes.toFixed(2)} min`;
        }
      case 'device':
        if (d.machineStatus == 'R') {
          return `
      Part: ${d.partId}<br />
      Operator: ${d.operator}<br />
      Parts: ${d.parts}<br />
      Operations: ${d.cycles}<br />
      Duration: ${d.durationMinutes.toFixed(2)} min`;
        } else {
          return `
          Duration: ${d.durationMinutes.toFixed(2)} min`;
        }
    }
  }

  zoomed(event: any) {
    this.transform = event.transform;
    const nx = event.transform.rescaleX(this.xScale);
    let minXTime: string = this.data.runBlocks[0]?.startTime;

    this.xAxisbar.call(
      d3
        .axisBottom(nx)
        .ticks(15)
        .tickFormat((d: number) => {
          let tm = new Date(new Date(minXTime).getTime() + d * 60000);
          return (
            tm.getHours() +
            ':' +
            tm.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 })
          );
        })
    );

    this.svg.selectAll('rect.bar').attr('transform', (d: IRunblockItem, i: number) => {
      return 'translate(' + event.transform.x + ',0)scale(' + event.transform.k + ',1)';
    });

    this.svg.selectAll('path.symbol').attr('transform', (d: IRunblockMachineEvent, i: number) => {
      const diffTime = new Date(d.recordDate).getTime() - new Date(minXTime).getTime();
      return 'translate(' + nx(diffTime / 60000) + ',' + this.yScale(0) + ')scale(1, 1)';
    });

    this.svg.selectAll('rect.sc-bar').attr('transform', (d: IRunblockItem, i: number) => {
      return 'translate(' + event.transform.x + ',0)scale(' + event.transform.k + ',1)';
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.runBlocks) {
      if (!this.svg) {
        this.drawChart();
      } else {
        this.updateChart();
      }
    }
  }
}
