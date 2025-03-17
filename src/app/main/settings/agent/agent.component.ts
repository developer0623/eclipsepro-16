import { Component } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { SystemInfoService } from 'src/app/main/shared/services/system-info.service';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
})
export class AgentComponent {
  constructor(public media: MediaObserver, public systemInfoService: SystemInfoService) {}
}
