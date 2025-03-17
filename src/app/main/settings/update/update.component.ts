import { Component } from '@angular/core';
import { IUpdateInfo } from 'src/app/core/dto';
import { SystemInfoService } from '../../shared/services/system-info.service';

@Component({
  selector: 'update-settings',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent {
  updateInfo: IUpdateInfo = {} as IUpdateInfo;
  constructor(private systemInfoService: SystemInfoService) {
    this.systemInfoService.getUpdateInfo().subscribe((data) => {
      this.updateInfo = data;
    });
  }
}
