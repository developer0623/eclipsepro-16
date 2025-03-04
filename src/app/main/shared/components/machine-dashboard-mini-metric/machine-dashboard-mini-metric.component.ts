import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  IMachineStateDto,
  IMetricConfigWithDef,
  IRollformingStatistics,
  IScheduleSummary,
} from 'src/app/core/dto';

@Component({
  selector: 'app-machine-dashboard-mini-metric',
  templateUrl: './machine-dashboard-mini-metric.component.html',
  styleUrls: ['./machine-dashboard-mini-metric.component.scss'],
})
export class MachineDashboardMiniMetricComponent implements OnChanges {
  @Input() machine;
  @Input() metric: IMetricConfigWithDef;
  @Input() renderUnlicensed;

  parent: IMachineStateDto | IRollformingStatistics | IScheduleSummary;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.metric?.def?.collection) {
      this.parent = this.machine[this.metric.def.collection];
    }
  }
}
