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
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { EventService, TimeLineEvent } from '../../services/event.service';
import { UnitsService } from '../../services/units.service';
import { IScheduleEntry } from 'src/app/core/dto';

@Component({
  selector: 'app-timeline-block',
  templateUrl: './timeline-block.component.html',
  styleUrls: ['./timeline-block.component.scss'],
})
export class TimelineBlockComponent implements OnInit, OnDestroy, OnChanges {
  @Input() name: string;
  @Input() machineNumber: number;
  @Input() displayXDomain: Date[];
  @Input() height = 100;
  @Input() width = 0;
  @Input() radius = 0;
  @Input() data: IScheduleEntry[];
  @Input() searchText = '';
  @Input() showXAxis: boolean;
  @Input() brushOutput: d3.ValueFn<SVGGElement, unknown, [[number, number], [number, number]]>;
  @Input() cursorTime: Date;
  @ViewChild('timelineSvg', { static: true }) timelineSvg: ElementRef;
  paddingTop: number = 0;
  paddingRight: number = 0;
  paddingBottom: number = 40;
  paddingLeft: number = 0;
  scaleWidth: number = 0;
  scaleHeight: number = 0;
  xValDomain: Date[] = [];
  zoom: d3.ZoomBehavior<Element, unknown>;
  xScale: d3.ScaleTime<number, number, never>;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  gCursor: d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  inZoom = false;
  gMain: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  transform: d3.ZoomTransform;
  private eventSubscription: Subscription;

  constructor(
    private elementRef: ElementRef,
    private unitsService: UnitsService,
    private eventService: EventService
  ) {
    this.paddingBottom = this.showXAxis ? 40 : 0;
  }

  ngOnInit(): void {
    this.initChart();
  }

  initChart() {
    const svgElement = this.timelineSvg.nativeElement;
    this.width = this.width || svgElement.clientWidth;
    this.scaleWidth = this.width - this.paddingLeft - this.paddingRight;
    this.scaleHeight = this.height - this.paddingTop - this.paddingBottom;
    this.xValDomain = this.displayXDomain || [
      d3.min(this.data, (d: any) => {
        return new Date(d.startDateTime);
      }),
      d3.max(this.data, (d: any) => {
        return new Date(d.endDateTime);
      }),
    ];
    this.xScale = d3.scaleTime().range([0, this.scaleWidth]).domain(this.xValDomain);
    this.svg = d3
      .select(svgElement)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('font-size', '10');

    let defs = this.svg.append('defs');
    defs
      .append('clipPath')
      .attr('id', 'timeblock-clip')
      .append('rect')
      .attr('width', this.scaleWidth)
      .attr('height', '100%');

    let coilWarnPattern = defs
      .append('pattern')
      .attr('id', 'pattern-coilwarn')
      .attr('width', '10')
      .attr('height', '10')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', 'rotate(60 0 0)');

    coilWarnPattern
      .append('rect')
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', '10')
      .attr('height', '10')
      .style('fill', '#F2D20C');
    coilWarnPattern
      .append('line')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '10')
      .style('stroke', '#D32F2F')
      .style('stroke-width', '10');

    let gChart = this.svg
      .append('g')
      .attr('transform', `translate(${this.paddingLeft},${this.paddingTop})`)
      .attr('width', this.scaleWidth)
      .attr('height', this.scaleHeight)
      .attr('clip', 'url(#timeblock-clip)');

    gChart
      .append('rect')
      .attr('class', 'chartbody')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('y', '1');

    this.gMain = gChart.append('g').attr('class', 'timeBlock').attr('height', this.scaleHeight);

    let gBrush = this.gMain.append('g').attr('class', 'brush');
    this.tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'eventToolTip')
      .attr('position', 'absolute')
      .style('opacity', 0);

    if (this.brushOutput) {
      let brush = d3
        .brushX()
        .extent(this.brushOutput)
        .on('end', () => {
          this.brushOutput = brush.extent();
        });
      gBrush
        .attr('fill-opacity', 0.125)
        .call(brush)
        .selectAll('rect')
        .attr('height', this.scaleHeight);
    } else {
      // Setup zoom and pan behavior (since we're not a brush/range display)
      this.zoom = d3
        .zoom()
        .scaleExtent([0.5, 10])
        .extent([
          [0, 0],
          [this.scaleWidth, this.scaleHeight],
        ])
        .on('zoom', (e) => this.zoomHandler(e))
        .on('start', () => this.zoomStart())
        .on('end', () => this.zoomEnd());
      this.svg.call(this.zoom).on('dblclick.zoom', null);
    }

    this.gCursor = gChart
      .append('g')
      .attr('class', 'cursor')
      .append('line')
      .attr('y1', 0)
      .attr('y2', '100%');

    this.drawCursor();
    if (this.data) {
      this.draw();
    }

    this.eventSubscription = this.eventService.getEvent().subscribe((event: TimeLineEvent) => {
      this.transform = event.transform;
      this.xValDomain = event.domain;
      this.drawCursor();
      this.draw();
    });
  }

  zoomStart() {
    this.tooltip.transition().style('opacity', 0);
    this.inZoom = true;
  }
  zoomEnd() {
    this.tooltip.transition().duration(2000).style('opacity', 1);
    this.inZoom = false;
  }

  zoomHandler(event) {
    const nx = event.transform.rescaleX(this.xScale);
    this.eventService.emitEvent({ domain: nx.domain(), transform: event.transform });
  }

  drawCursor() {
    if (!this.xScale) {
      return;
    }
    let nx: d3.ScaleTime<number, number, never>;
    if (this.transform) {
      nx = this.transform.rescaleX(this.xScale);
    } else {
      nx = this.xScale;
    }
    let x = nx(this.cursorTime);
    this.gCursor.attr('x1', x);
    this.gCursor.attr('x2', x);
  }

  tooltipMap(d) {
    let startDate = new Date(d.startDateTime);
    let endDate = new Date(d.endDateTime);
    let startHours = startDate.getHours();
    let startMinutes: any = startDate.getMinutes();
    let startampm = startHours >= 12 ? 'PM' : 'AM';
    startHours = startHours % 12;
    startHours = startHours ? startHours : 12; // the hour '0' should be '12'
    startMinutes = startMinutes < 10 ? '0' + startMinutes : startMinutes;
    let startTime = `<span style="font-weight:600;font-size:15px">${startHours}:${startMinutes}</span>
      <span style="font-size:11px;font-weight:600;">${startampm}</span>`;

    let endHours = endDate.getHours();
    let endMinutes: any = endDate.getMinutes();
    let endampm = endHours >= 12 ? 'PM' : 'AM';
    endHours = endHours % 12;
    endHours = endHours ? endHours : 12; // the hour '0' should be '12'
    endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes;
    let endTime =
      '<span style="font-weight:600;font-size:15px">' +
      endHours +
      ':' +
      endMinutes +
      '</span> ' +
      '<span style="font-size:11px;font-weight:600;">' +
      endampm +
      '</span>';

    let formatStartDate =
      startDate.getMonth() +
      1 +
      '/' +
      startDate.getDate() +
      '/' +
      startDate.getFullYear().toString().substr(2, 2);
    let formatendDate =
      endDate.getMonth() +
      1 +
      '/' +
      endDate.getDate() +
      '/' +
      endDate.getFullYear().toString().substr(2, 2);

    let durationMs = d.activityType === 'Production' ? d.remainingRuntimeMs : d.durationMs;
    let durationMins = Math.floor(durationMs / (1000 * 60)) % 60;
    let durationHours = Math.floor(durationMs / (1000 * 60 * 60)) % 24;
    let durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));

    let daysText =
      durationDays !== 0
        ? '<span class="duration">' + durationDays + '</span><span class="durationTime">d</span>'
        : '';

    let hoursText =
      durationHours !== 0
        ? '<span class="duration">' + durationHours + '</span><span class="durationTime">h</span>'
        : '';

    let timeBlock = `<div class="brdr-top"><table><tr>
        <td><div class="mrgnRght">${formatStartDate}</div><div class="grnBrdr">${startTime}</div></td>
        <td><div class="mrgnRght">&nbsp;</div>
          <span class="greenClr">
            ${daysText} ${hoursText}
            <span class="duration">${durationMins}</span>
            <span class="durationTime">m</span>
          </span></td>
        <td>
          <div class="mrgnRght">${formatendDate}</div>
          <div class="grnBrdr">${endTime}</div>
        </td></tr></table></div>`;

    let activityTitle;
    if (d.activityType === 'ToolAndMaterialChange') {
      activityTitle = 'Tool And Material Change';
    } else if (d.activityType === 'ToolChange') {
      activityTitle = 'Tool Change';
    } else if (d.activityType === 'MachineConfig') {
      activityTitle = 'Machine Config';
    } else if (d.activityType === 'MaterialChange') {
      activityTitle = 'Material Change';
    } else if (d.activityType === 'CoilChange') {
      activityTitle = 'Coil Change';
    } else if (d.activityType === 'Maintenance') {
      activityTitle = 'Maintenance';
    } else if (d.activityType === 'Breakdown') {
      activityTitle = 'Breakdown';
    } else if (d.activityType === 'Production') {
      activityTitle = 'Production';
    } else if (d.activityType === 'Unscheduled') {
      activityTitle = 'Unscheduled';
    } else if (d.activityType === 'Break') {
      activityTitle = 'Break';
    } else if (d.activityType === 'Meeting') {
      activityTitle = 'Meeting';
    } else {
      activityTitle = d.activityType + ' - ' + d.title;
    }

    if (d.activityType === 'Production') {
      let orderCode = d.orderCode;
      let customerName = d.customerName;
      let percentageComplete = Math.round(((d.totalFt - d.remainingFt) / d.totalFt) * 100);
      return `<div class="scheduleTooltip" style="color:#8FAE17; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        <div style="font-weight:600;color:#000000">${orderCode}</div>
        <div>${customerName}</div>
        ${timeBlock}
        <div style="margin-top:10px">
        <table class="innerTable"><tr><th>TOTAL</th><th>REMAINING</th><th>PERCENTAGE</th></tr><tr>
          <td>${this.unitsService.formatUserUnits(d.totalFt, 'ft', 0)}</td>
          <td>${this.unitsService.formatUserUnits(d.remainingFt, 'ft', 0)}</td>
          <td>${percentageComplete}</td>
        </tr></table></div>`;
    } else if (
      d.activityType === 'ToolAndMaterialChange' ||
      d.activityType === 'MachineConfig' ||
      d.activityType === 'MaterialChange' ||
      d.activityType === 'ToolChange'
    ) {
      return `<div style="color:#F68B1F; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}
        <div style="margin-top:10px">
        <table class="innerTable"><tr><th style="width:50%;">MATERIAL</th><th>TOOLING</th><th>TOTAL</th></tr><tr>
          <td>${d.materialCode}</td>
          <td>${d.toolingCode}</td>
          <td>${this.unitsService.formatUserUnits(d.totalFt, 'ft', 0)}</td>
        </tr></table></div>`;
    } else if (d.activityType === 'Unscheduled') {
      return `<div style="color:#000000; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}
        <div style="margin-top:10px">
        <table class="innerTable"><tr><th>TITLE</th></tr><tr>
          <td>${d.title}</td>
        </tr></table></div>`;
    } else if (d.activityType === 'Break') {
      return `<div style="color:#0071B5; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}
        <div style="margin-top:10px">
        <table class="innerTable"><tr><th>TITLE</th></tr><tr>
          <td>${d.title}</td>
        </tr></table></div>`;
    } else if (d.activityType === 'Meeting') {
      return `<div style="color:#11897D; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}
        <div style="margin-top:10px"><table class="innerTable"><tr><th style="width:0;">TITLE</th></tr><tr>
          <td>${d.title}</td>
        </tr></table></div>`;
    } else if (d.activityType === 'CoilChange') {
      let coilId = (d.coilUsed && d.coilUsed.coilId) || '«none»';
      let coilFt = (d.coilUsed && d.coilUsed.coilId && Math.round(d.coilUsed.coilFt)) || 0;
      return `<div style="color:#F2D20C; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}
        <div style="margin-top:10px"><table class="innerTable"><tr><th>MATERIAL</th><th>PREFERRED COIL</th><th>REMAINING</th></tr><tr>
          <td>${d.materialCode}</td>
          <td>${coilId}</td>
          <td>${this.unitsService.formatUserUnits(coilFt, 'ft', 0)}</td>
        </tr></table></div>`;
    } else if (d.activityType === 'Maintenance') {
      return `<div style="color:#74592E; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}
        <div style="margin-top:10px;"><table class="innerTable"><tr><th style="width:0;">TITLE</th></tr><tr>
          <td>${d.title}</td>
        </tr></table></div>`;
    } else if (d.activityType === 'Breakdown') {
      return `<div style="color:#942015; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}
        <div style="margin-top:10px;"><table class="innerTable"><tr><th style="width:0;">TITLE</th></tr><tr>
          <td>${d.title}</td>
        </tr></table></div>`;
    } else {
      return `<div style="color:#000000; text-transform:uppercase;font-size:11px;padding-bottom:3px;">${activityTitle}</div>
        ${timeBlock}`;
    }
  }

  blockHeightMap(d) {
    if (d.activityType === 'Break' || d.activityType === 'Meeting') {
      return '43.3%';
    } else if (d.activityType === 'CoilChange') {
      return '30%';
    } else if (d.activityType === 'Unscheduled') {
      return '47%';
    } else if (
      d.activityType === 'Maintenance' ||
      d.activityType === 'ToolAndMaterialChange' ||
      d.activityType === 'Breakdown' ||
      d.activityType === 'MachineConfig' ||
      d.activityType === 'MaterialChange' ||
      d.activityType === 'ToolChange'
    ) {
      return '85%';
    } else if (d.activityType === 'Production') {
      return '58.3%';
    } else {
      return '20%';
    }
  }

  position(d) {
    if (
      d.activityType === 'Production' ||
      d.activityType === 'CoilChange' ||
      d.activityType === 'Maintenance' ||
      d.activityType === 'Breakdown'
    ) {
      return '6';
    } else if (
      d.activityType === 'ToolAndMaterialChange' ||
      d.activityType === 'MaterialChange' ||
      d.activityType === 'MachineConfig' ||
      d.activityType === 'ToolChange'
    ) {
      return '7';
    } else if (d.activityType === 'Unscheduled') {
      return '-1';
    } else if (d.activityType === 'Break' || d.activityType === 'Meeting') {
      return '0';
    } else {
      return '20';
    }
  }

  textPosition(d) {
    if (d.activityType === 'Production') {
      return '34';
    } else if (d.activityType === 'MachineConfig') {
      return '55';
    }
  }

  tspanPosition(d) {
    if (d.activityType === 'Production') {
      return '36';
    } else if (d.activityType === 'MachineConfig') {
      return '58';
    }
  }

  zIndexMap(d) {
    if (
      d.activityType === 'Unscheduled' ||
      d.activityType === 'Break' ||
      d.activityType === 'Meeting'
    ) {
      return 5;
    } else if (d.activityType === 'Late') {
      return 4;
    } else if (
      d.activityType === 'CoilChange' ||
      d.activityType === 'Maintenance' ||
      d.activityType === 'Breakdown'
    ) {
      return 3;
    } else if (d.activityType === 'Production') {
      return 2;
    } else if (
      d.activityType === 'MaterialChange' ||
      d.activityType === '' ||
      d.activityType === 'MachineConfig' ||
      d.activityType === 'ToolChange' ||
      d.activityType === 'ToolAndMaterialChange'
    ) {
      return 1;
    } else {
      return 6;
    }
  }
  searchTextMap(d) {
    return d.orderCode + d.materialCode + d.toolingCode;
  }
  titleMap(d) {
    return d.orderCode + d.materialCode + d.toolingCode;
  }

  setLeftColor(d) {
    if (d.activityType === 'Production') {
      return '#8CAB12';
    }
    if (d.activityType === 'MachineConfig') {
      return '#F68B1F';
    }
  }
  setRightColor(d) {
    if (d.activityType === 'Production') {
      return '#BED75D';
    }
    if (d.activityType === 'MachineConfig') {
      return '#F1CE9F';
    }
  }

  warningMap(d) {
    if (!Array.isArray(d) || !d.length) {
      return '';
    }
    return d
      .map((w) => {
        return w.toLowerCase();
      })
      .join(' ');
  }

  //redraw chart content
  draw() {
    let startDate = this.xValDomain[0];
    let endDate = this.xValDomain[1];

    // Sort data by z index
    this.data.sort((x, y) => {
      return d3.ascending(this.zIndexMap(x), this.zIndexMap(y));
    });

    let nx;
    if (this.transform) {
      nx = this.transform.rescaleX(this.xScale);
    } else {
      nx = this.xScale;
    }

    const filteredData = this.data.filter(
      (d) =>
        endDate >= new Date(d.startDateTime) &&
        startDate <= new Date(d.endDateTime) &&
        nx(new Date(d.endDateTime)) - nx(new Date(d.startDateTime)) >= 2
    );

    // Data binding
    let timeBlocks = this.gMain
      .selectAll('.svg-rect')
      .data(filteredData, (d: IScheduleEntry) => d.id);

    // Update existing objects
    timeBlocks.join(
      (enter) => {
        return this.addChart(enter);
      },
      (update) => {
        return this.updateChart(update);
      },
      (exit) => exit.remove()
    );
  }

  searchDraw() {
    this.gMain.selectAll('.svg-rect').classed('muted', (d) => {
      let keysOfPrntObj = Object.keys(d);
      let searchString = '';
      for (let i = 0; i < keysOfPrntObj.length; i++) {
        if (
          d[keysOfPrntObj[i]] &&
          keysOfPrntObj[i] !== 'remainingFt' &&
          keysOfPrntObj[i] !== 'totalFt'
        ) {
          searchString += d[keysOfPrntObj[i]];
        }
      }
      return (
        this.searchText &&
        searchString &&
        !searchString.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  addChart(enter) {
    // Handle objects that were just added to the collection
    let blocksEnter = enter
      .append('svg')
      .attr('class', 'svg-rect')
      .attr('y', 0)
      .attr('height', '100%')
      .on('mouseover', (e, d) => {
        this.tooltip
          .transition()
          .duration(200)
          .style('opacity', 1)
          .style('z-index', 1)
          .style('display', 'block');
        this.tooltip.html(() => this.tooltipMap(d));
      })
      .on('mousemove', (e) => {
        let tooltipHeight = this.tooltip.node().clientHeight;
        let tooltipWidth = this.tooltip.node().clientWidth;
        let graphInnerWidth = document.getElementById('graph-div').offsetWidth;
        let cursorPosition = d3.pointer(document.getElementById('graph-div'))[0];
        //tooltipPosOffset is initiated with 10px to show distance between cursor and tooltip.
        let tooltipPosOffset = 10;
        //checking if toottip will fit to right of cursor by comparing difference
        // between graph-div position and cursor position. If it is  less than tooltip width,
        // then changing tooltip position to left of cursor. Tooltip width was reduced
        // by another 20 px to make use of extra padding available for graph-div.
        if (graphInnerWidth - cursorPosition < tooltipWidth - 20) {
          tooltipPosOffset = -340;
        }
        return this.tooltip
          .style('top', e.pageY - tooltipHeight + 'px')
          .style('left', e.pageX + tooltipPosOffset + 'px');
      })
      .on('mouseout', (d) => {
        this.tooltip.transition().style('z-index', 0).duration(500).style('display', 'none');
      })
      .on('dblclick', (e, d) => {
        if (
          d.activityType === 'MaterialChange' ||
          d.activityType === 'MachineConfig' ||
          d.activityType === 'Production' ||
          d.activityType === 'CoilChange'
        ) {
          this.tooltip.transition().style('z-index', 0).style('display', 'none');
        }
        if (d.downtimeId) {
          // $rootScope.$broadcast('openDowntimePopup', d);
        } else if (d.activityType === 'Production') {
          // this.state.go('app.orders.detail', { id: d.ordId }); we need to fix
        } else if (
          d.activityType === 'MaterialChange' ||
          d.activityType === 'MachineConfig' ||
          d.activityType === 'CoilChange'
        ) {
          // this.state.go('app.inventory_coil-types.detail', { id: d.materialCode }); we need to fix
        } else if (d.downtimeId !== '') {
          //what is this for?
          console.log('Downtime:' + d.downtimeId);
          // this.state.go('app.inventory_coil-types.detail', { id: d.materialCode });
        }
      })
      .attr('x', (d) => {
        if (this.transform) {
          const nx = this.transform.rescaleX(this.xScale);
          return nx(new Date(d.startDateTime));
        } else {
          return this.xScale(new Date(d.startDateTime));
        }
      })
      .attr('width', (d) => {
        if (this.transform) {
          const nx = this.transform.rescaleX(this.xScale);
          return nx(new Date(d.endDateTime)) - nx(new Date(d.startDateTime));
        } else {
          return this.xScale(new Date(d.endDateTime)) - this.xScale(new Date(d.startDateTime));
        }
      })
      .classed('muted', (d) => {
        let keysOfPrntObj = Object.keys(d);
        let searchString = '';
        for (let i = 0; i < keysOfPrntObj.length; i++) {
          if (
            d[keysOfPrntObj[i]] &&
            keysOfPrntObj[i] !== 'remainingFt' &&
            keysOfPrntObj[i] !== 'totalFt'
          ) {
            searchString += d[keysOfPrntObj[i]];
          }
        }
        return (
          this.searchText &&
          searchString &&
          !searchString.toLowerCase().includes(this.searchText.toLowerCase())
        );
      });

    let defs = blocksEnter.append('defs');
    let filter = defs.append('filter').attr('id', (d) => {
      if (d.activityType === 'Breakdown') {
        return 'dropshadow';
      }
    });
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '5 0');

    let gradient = defs
      .append('linearGradient')
      .attr('id', (d) => {
        return d.activityType + '_' + d.id;
      })
      .attr('x1', '0')
      .attr('x2', '1')
      .attr('y1', '0')
      .attr('y2', '0');
    //Linear gradient for timeblock objects

    gradient
      .append('stop')
      .attr('offset', '0')
      .attr('stop-color', (d) => this.setLeftColor(d));

    gradient
      .append('stop')
      .attr('offset', '1')
      .attr('stop-color', (d) => this.setRightColor(d));

    // Handle objects that are no longer in the collection
    // timeBlocks.exit().remove();

    blocksEnter
      .append('rect')
      .attr('x', 0)
      .attr('width', '100%')
      .attr('y', (d) => this.position(d))
      .attr('height', (d) => this.blockHeightMap(d))
      .attr('class', (d) => {
        //return cssClassMap(d);
        return (
          d.activityType.toLowerCase() +
          ' ' +
          d.state.toLowerCase() +
          ' ' +
          this.warningMap(d.warnings) +
          ' ' +
          d.id
        );
      })
      .style('filter', (d) => {
        if (d.activityType === 'Breakdown') {
          return 'url(#dropshadow)';
        }
      })
      .style('fill', (d) => {
        if (d.activityType === 'Production' || d.activityType === 'MachineConfig') {
          return 'url(#' + d.activityType + '_' + d.id + ')';
        }
      });

    //Appending line to remove vertical green lines for back to back Unscheduled blocks

    // Right Line
    blocksEnter
      .append('line')
      .style('stroke', (d) => {
        if (d.activityType === 'Unscheduled' && d.showRightLine) {
          return '#8FAE17';
        }
      })
      .style('stroke-width', '2px')
      .style('opacity', '0.7')
      .attr('x1', '100%')
      .attr('y1', '0')
      .attr('x2', '100%')
      .attr('y2', '46%');

    // Left Line
    blocksEnter
      .append('line')
      .style('stroke', (d) => {
        if (d.activityType === 'Unscheduled' && d.showLeftLine) {
          return '#8FAE17';
        }
      })
      .style('stroke-width', '2px')
      .style('opacity', '0.7')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '46%');

    // Bottom Line
    blocksEnter
      .append('line')
      .style('stroke', (d) => {
        if (d.activityType === 'Unscheduled') {
          return '#8FAE17';
        }
      })
      .style('opacity', '0.7')
      .attr('y1', '46%')
      .attr('x2', '100%')
      .attr('y2', '46%');

    // Appending Text
    let texts = blocksEnter
      .append('text')
      .attr('y', (d) => this.textPosition(d))
      .attr('x', 5)
      .attr('dominant-baseline', 'text-before-edge');

    texts
      .append('tspan')
      .style('font-size', '14px')
      .style('fill', '#4b5a47')
      .style('font-weight', '600')
      .style('cursor', 'default')
      .text((d) => {
        if (d.activityType === 'Production') {
          return d.orderCode;
        }
      });
    texts
      .append('tspan')
      .attr('y', (d) => this.tspanPosition(d))
      .style('font-size', '11px')
      .style('fill', '#4b5a47')
      .style('cursor', 'default')
      .text((d) => {
        if (d.activityType === 'Production') {
          return d.customerName ? ' -' + d.customerName : '';
        }
      });
    texts
      .append('tspan')
      .attr('y', (d) => this.tspanPosition(d))
      .style('font-size', '11px')
      .style('fill', '#8e5715')
      .style('cursor', 'default')
      .text((d) => {
        if (d.activityType === 'MachineConfig') {
          return 'MATERIAL:';
        }
      });
    texts
      .append('tspan')
      .attr('y', (d) => this.textPosition(d))
      .style('font-size', '14px')
      .style('fill', '#8e5715')
      .style('font-weight', '600')
      .style('cursor', 'default')
      .text((d) => {
        if (d.activityType === 'MachineConfig') {
          return d.materialCode;
        }
      });
    texts
      .append('tspan')
      .attr('y', (d) => this.tspanPosition(d))
      .style('font-size', '11px')
      .style('fill', '#8e5715')
      .style('cursor', 'default')
      .text((d) => {
        if (d.activityType === 'MachineConfig') {
          return ' TOOLING:';
        }
      });
    texts
      .append('tspan')
      .attr('y', (d) => this.textPosition(d))
      .style('font-size', '14px')
      .style('fill', '#8e5715')
      .style('font-weight', '600')
      .style('cursor', 'default')
      .text((d) => {
        if (d.activityType === 'MachineConfig') {
          return d.toolingCode;
        }
      });

    return blocksEnter;
  }

  updateChart(update) {
    let blocksEnter = update
      .attr('x', (d) => {
        if (this.transform) {
          const nx = this.transform.rescaleX(this.xScale);
          return nx(new Date(d.startDateTime));
        } else {
          return this.xScale(new Date(d.startDateTime));
        }
      })
      .attr('width', (d) => {
        if (this.transform) {
          const nx = this.transform.rescaleX(this.xScale);
          return nx(new Date(d.endDateTime)) - nx(new Date(d.startDateTime));
        } else {
          return this.xScale(new Date(d.endDateTime)) - this.xScale(new Date(d.startDateTime));
        }
      });

    return blocksEnter;
  }

  ngOnDestroy(): void {
    this.tooltip.transition().style('z-index', 0).duration(500).style('display', 'none');
    this.eventSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawCursor();
    if (
      changes.data &&
      changes.data.currentValue &&
      changes.data.currentValue.length > 0 &&
      this.svg
    ) {
      this.draw();
    }

    if (changes.searchText && this.svg) {
      this.searchDraw();
    }
  }
}
