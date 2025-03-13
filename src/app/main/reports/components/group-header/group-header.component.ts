import { Component, Input } from '@angular/core';

interface GroupHeader {
  goodFt: number;
  goodLbs: number;
  netScrapFt: number;
  netScrapLbs: number;
  reclaimedLbs: number;
  reclaimedScrapFt: number;
  runMinutes: number;
  scrapFtPct: number;
  scrapLbsPct: number;
  totalFt: number;
  totalLbs: number;
  totalMinutes: number;
  scrapLbs: number;
}

@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.scss'],
})
export class GroupHeaderComponent {
  @Input() header: GroupHeader;
}
