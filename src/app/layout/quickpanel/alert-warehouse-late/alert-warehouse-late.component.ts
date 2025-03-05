import { Component, Input } from '@angular/core';
import { IAlert } from 'src/app/core/dto';

@Component({
  selector: 'app-alert-warehouse-late',
  templateUrl: './alert-warehouse-late.component.html',
  styleUrls: ['./alert-warehouse-late.component.scss']
})
export class AlertWarehouseLateComponent {
  @Input() alert: IAlert = {} as IAlert;

}
