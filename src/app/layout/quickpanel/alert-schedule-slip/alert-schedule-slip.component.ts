import { Component, Input } from '@angular/core';
import { IAlert } from 'src/app/core/dto';

@Component({
  selector: 'app-alert-schedule-slip',
  templateUrl: './alert-schedule-slip.component.html',
  styleUrls: ['./alert-schedule-slip.component.scss']
})
export class AlertScheduleSlipComponent {
  @Input() alert: IAlert = {} as IAlert;

}
