import { Component, Input } from '@angular/core';
import { HealthSummaryType, IHealth } from 'src/app/core/dto';

@Component({
  selector: 'service-health-grid',
  templateUrl: './service-health.component.html',
  styleUrls: ['./service-health.component.scss'],
})
export class ServiceHealthComponent {
  @Input() healths: IHealth[] = [];
  @Input() healthSummary: HealthSummaryType[] = [];
  constructor() {}
  trackByID(index, task) {
    return task.id;
  }
}
