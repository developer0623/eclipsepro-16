import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ams } from 'src/app/amsconfig';
import { IUpdateInfo, IAgentStatus } from 'src/app/core/dto';

@Injectable({
  providedIn: 'root',
})
export class SystemInfoService {
  lastServerUpdate: number;
  systemInfo: any = {};
  updateInfo: IUpdateInfo = {} as IUpdateInfo;
  agentStatus: IAgentStatus = {} as IAgentStatus;

  constructor(private http: HttpClient) {
    this.getCurrentSystemInfo();
  }
  refresh() {
    this.getCurrentSystemInfo();
  }

  getUpdateInfo() {
    return this.http.get<IUpdateInfo>(Ams.Config.BASE_URL + '/api/checkUpdate');
  }

  private getCurrentSystemInfo() {
    this.http.get<IUpdateInfo>(Ams.Config.BASE_URL + '/api/checkUpdate').subscribe((data) => {
      this.updateInfo = data;
    });

    this.http.get<IAgentStatus>(Ams.Config.BASE_URL + '/api/agentStatus').subscribe((data) => {
      this.agentStatus = data;
    });
  }
}
