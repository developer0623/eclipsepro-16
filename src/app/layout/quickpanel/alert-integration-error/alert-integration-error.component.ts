import { Component, Input } from '@angular/core';
import { IAlert } from 'src/app/core/dto';


@Component({
  selector: 'app-alert-integration-error',
  templateUrl: './alert-integration-error.component.html',
  styleUrls: ['./alert-integration-error.component.scss']
})
export class AlertIntegrationErrorComponent {
  @Input() alert: IAlert = {} as IAlert;

}
