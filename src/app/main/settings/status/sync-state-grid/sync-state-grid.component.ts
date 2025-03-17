import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Ams } from 'src/app/amsconfig';
import { ISyncState } from 'src/app/core/dto';

@Component({
  selector: 'sync-state-grid',
  templateUrl: './sync-state-grid.component.html',
  styleUrls: ['./sync-state-grid.component.scss'],
})
export class SyncStateGridComponent {
  @Input() syncState: ISyncState[] = [];
  constructor(private http: HttpClient) {}
  triggerSync(doc: string) {
    this.http
      .post(Ams.Config.BASE_URL + `/api/system/forceAgentSync/${doc.slice(10)}`, {})
      .subscribe();
  }
}
