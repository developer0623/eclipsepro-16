import { Component, Input } from '@angular/core';
import { IAlert } from 'src/app/core/dto';

@Component({
  selector: 'system-alerts-grid',
  templateUrl: './system-alerts.component.html',
  styleUrls: ['./system-alerts.component.scss'],
})
export class SystemAlertsComponent {
  @Input() alerts: IAlert[] = [];
}
