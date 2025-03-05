import { Component, Input } from '@angular/core';
import { IAlert } from 'src/app/core/dto';

@Component({
  selector: 'app-alert-licensing',
  templateUrl: './alert-licensing.component.html',
  styleUrls: ['./alert-licensing.component.scss']
})
export class AlertLicensingComponent {
  @Input() alert: IAlert = {} as IAlert;

}
