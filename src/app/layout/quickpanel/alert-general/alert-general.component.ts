import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAlert } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-alert-general',
  templateUrl: './alert-general.component.html',
  styleUrls: ['./alert-general.component.scss']
})
export class AlertGeneralComponent {
  @Input() alert: IAlert = {} as IAlert;
  constructor(private http: HttpClient) {

  }
  postAction(url) {
    console.log('1111', url)
    this.http.post(`${Ams.Config.BASE_URL}${url}`, {}).subscribe()
  }

  getClass(alert: IAlert) {
    if(alert.icon)
    return 'mdi-' + alert.icon + ' ' + alert.iconColor
    return ''
  }

}
