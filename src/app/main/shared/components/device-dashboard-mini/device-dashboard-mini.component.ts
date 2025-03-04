import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-device-dashboard-mini',
  templateUrl: './device-dashboard-mini.component.html',
  styleUrls: ['./device-dashboard-mini.component.scss'],
})
export class DeviceDashboardMiniComponent implements OnChanges {
  @Input() device;
  @Input() deviceState;
  @Input() metrics;
  @Input() shiftStats;

  sortedMetrics: any[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    console.log('device update', changes);
    this.sortedMetrics = this.metrics.sort((a, b) => a.ordinal - b.ordinal);
  }
}
