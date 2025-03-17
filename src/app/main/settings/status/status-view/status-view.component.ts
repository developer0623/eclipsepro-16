import * as _ from 'lodash';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router  } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ams } from 'src/app/amsconfig';
import {
  HealthSummaryType,
  IAlert,
  IHealth,
  ISyncState,
  IPendingActionsToAgent,
} from 'src/app/core/dto';
import { SystemInfoService } from 'src/app/main/shared/services/system-info.service';
import { ClientDataStore } from 'src/app/main/shared/services/clientData.store';
import {
  selectSystemInfo,
  selectSystemPreferences,
} from 'src/app/main/shared/services/store/misc/selectors';
import { selectHealthSummary } from 'src/app/main/shared/services/store/settings/selectors';

interface IInRavenButNotDbfs {
  collections: { [key: string]: number };
}

@Component({
  selector: 'status-view',
  templateUrl: './status-view.component.html',
  styleUrls: ['./status-view.component.scss'],
})
export class StatusViewComponent implements OnDestroy {
  selectedTabIndex = 0;
  healths: IHealth[] = [];
  alerts: IAlert[] = [];
  syncState: ISyncState[] = [];
  systemInfo = { isSignalRConnected: false, signalRConnectionId: '', serverStartTime: null };
  pendingAgentActions: IPendingActionsToAgent[] = [];
  inRavenButNotDbfs: { collection: string; count: number }[] = [];
  healthSummary: HealthSummaryType[] = [];
  private subscriptions_: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private clientDataStore: ClientDataStore,
    public systemInfoService: SystemInfoService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.systemInfoService.refresh();
    this.selectedTabIndex = Number(this.route.snapshot.paramMap.get('tab')) || 0;
    this.subscriptions_.push(
      this.store.select(selectSystemInfo).subscribe((sysInfo) => {
        this.systemInfo = sysInfo;
      })
    );
    this.subscriptions_.push(
      clientDataStore.SelectHealth().subscribe((healths) => {
        this.healths = _.orderBy(healths, ['status', 'serviceName']);
      })
    );
    this.subscriptions_ = [
      this.store.select(selectHealthSummary).subscribe((healthSummary) => {
        this.healthSummary = healthSummary;
      }),
      clientDataStore.SelectAlerts().subscribe((alerts) => {
        this.alerts = _.orderBy(
          alerts.filter((alert) => alert.isCritical),
          ['created']
        );
      }),
      clientDataStore.SelectSyncState().subscribe((sync) => {
        const newSync = [...sync];
        this.syncState = newSync.sort((a, b) => (a.id < b.id ? 1 : -1));
      }),

      clientDataStore.SelectPendingActionsToAgent().subscribe((actions) => {
        this.pendingAgentActions = actions;
      }),
    ];
    this.http
      .get<IInRavenButNotDbfs>(Ams.Config.BASE_URL + '/api/system/inRavenButNotDbfs')
      .subscribe({
        next: (data) => {
          this.inRavenButNotDbfs = data
            ? Object.keys(data.collections).map((item) => {
                return {
                  collection: item,
                  count: data.collections[item],
                };
              })
            : [];
        },
        error: (ex) => {
          console.log(ex);
        },
      });
  }
  private toast(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  triggerHistorySync() {
    this.http.post(Ams.Config.BASE_URL + `/api/system/startHistorySync`, {});
    this.toast('Agent history synchronization requested.');
  }
  toastDiagnosticDownload() {
    const message = 'Diagnostic package download initiated. Check your Downloads folder.';
    this.toast(message);
  }
  doDiagnosticUpload() {
    this.http.post(Ams.Config.BASE_URL + '/api/system/diagnostics/send', {}).subscribe({
      next: (_) => {
        this.toast('Uploaded successfully');
      },
      error: (ex) =>
        this.toast('Failed to upload. ' + ex.data.errors.reduce((x, y) => x + ' ' + y)),
    });
    const message = 'Diagnostic package upload initiated.';
    this.toast(message);
  }
  selectTab(index) {
    this.router.navigate([], {
      queryParams: {tab: index},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
  synchronizeOrdersWithAgent() {
    this.http.post<string>(Ams.Config.BASE_URL + '/api/orders/synccleanup', {}).subscribe({
      next: (resp) => {
        this.toast(resp);
      },
      error: (ex) => {
        this.toast('Failed. ' + ex.data);
      },
    });
  }
  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}
