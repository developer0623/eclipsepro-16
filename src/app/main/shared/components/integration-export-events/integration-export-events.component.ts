import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Ams } from 'src/app/amsconfig';
import { ClientDataStore } from '../../services/clientData.store';

@Component({
  selector: 'app-integration-export-events',
  templateUrl: './integration-export-events.component.html',
  styleUrls: ['./integration-export-events.component.scss'],
})
export class IntegrationExportEventsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ordId: number;
  @Input() hideComplete: boolean;
  exportEvents = [];
  filteredEvents = [];
  exportSub$: Subscription;

  constructor(public clientDataStore: ClientDataStore, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.ordId) {
      this.exportSub$ = this.clientDataStore
        .SelectChannelItemStatesIn({ property: 'relatedId', values: ['JobDetail/' + this.ordId] })
        .pipe(
          tap((items) => console.log(items)), // Logging items
          map((items) => items.filter((c) => c.relatedId === 'JobDetail/' + this.ordId)), // Filtering items
          map((items) => items.sort(this.descBy('receivedTime'))) // Sorting the filtered items
        )
        .subscribe((items) => {
          this.exportEvents = items;
          this.filterEvents();
          console.log('exportEvents', this.exportEvents);
        });
    } else {
      this.exportSub$ = this.clientDataStore.SelectChannelItemStates().subscribe((exportEvents) => {
        this.exportEvents = exportEvents.sort(this.descBy('receivedTime'));
        this.filterEvents();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterEvents();
  }

  filterEvents() {
    if (this.hideComplete) {
      this.filteredEvents = this.exportEvents.filter((item) => !item.complete);
    } else {
      this.filteredEvents = this.exportEvents;
    }
  }

  ngOnDestroy(): void {
    if (this.exportSub$) {
      this.exportSub$.unsubscribe();
    }
  }

  triggerExport = (itemId: string) => {
    console.log('trigger export:' + itemId);
    this.http
      .post<any>(Ams.Config.BASE_URL + `/_api/integration/retryExportAction?item=${itemId}`, {})
      .subscribe({
        next: (data) => {},
        error: (error) => {
          console.log(`integration error`, error);
        },
      });
  };

  cancelExport = (itemId: string) => {
    console.log('cancel export:' + itemId);
    this.http
      .post<any>(Ams.Config.BASE_URL + `/_api/integration/cancelExportAction?id=${itemId}`, {})
      .subscribe({
        next: (data) => {},
        error: (error) => {
          console.log(`integration error`, error);
        },
      });
  };

  descBy = <T>(key: keyof T) => {
    return (e1: T, e2: T) => (e1[key] > e2[key] ? -1 : e1[key] < e2[key] ? 1 : 0);
  };
}
