import { Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { UserHasRole } from '../../shared/services/store/user/selector';
import { AddConfigComponent } from './add-config/add-config.component';
import { IntegrationService } from '../../shared/services/integration.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
})
export class IntegrationComponent implements OnDestroy {
  userHasAdminRole = false;
  selectedTabIndex = 0;
  integrationTabs = [
    {
      label: 'Order Import',
      key: 'orderImport',
      items: [],
      enableRun: true,
    },
    {
      label: 'Coil Import',
      key: 'coilImport',
      items: [],
      enableRun: true,
    },
    {
      label: 'Export',
      key: 'export',
      items: [],
      enableRun: false,
    },
    {
      label: 'Material Import',
      key: 'materialImport',
      items: [],
      enableRun: true,
    },
    {
      label: 'Coil Validation',
      key: 'coilValidation',
      items: [],
      enableRun: false,
    },
    {
      label: 'Web Hooks',
      key: 'webhook',
      items: [],
      enableRun: true,
    },
    {
      label: 'Schedule Sync',
      key: 'scheduleSync',
      items: [],
      enableRun: true,
    },
    {
      label: 'External Connection',
      key: 'externalConnection',
      items: [],
      enableRun: false,
    },
  ];
  orderImportEvents = [];
  coilImportEvents = [];
  exportEvents = [];
  materialImportEvents = [];
  scheduleSyncEvents = [];
  coilValidationEvents = [];
  webhookEvents = [];
  hideComplete = false;
  subscriptions_: Subscription[] = [];

  constructor(
    private store: Store,
    private clientDataStore: ClientDataStore,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private integrationService: IntegrationService
  ) {
    this.selectedTabIndex = Number(this.route.snapshot.paramMap.get('tab')) || 0;
    this.subscriptions_ = [
      this.store.select(UserHasRole('administrator')).subscribe((userHasAdminRole) => {
        this.userHasAdminRole = userHasAdminRole;
      }),
      clientDataStore.SelectOrderImportConfigs().subscribe((configs) => {
        this.integrationTabs[0].items = [...configs];
      }),
      clientDataStore.SelectOrderImportEvents().subscribe((importEvents) => {
        this.orderImportEvents = importEvents.sort(this.descBy('start'));
      }),
      clientDataStore.SelectCoilImportConfigs().subscribe((configs) => {
        this.integrationTabs[1].items = [...configs];
      }),
      clientDataStore.SelectCoilImportEvents().subscribe((importEvents) => {
        this.coilImportEvents = importEvents.sort(this.descBy('start'));
      }),
      clientDataStore.SelectExportConfigs().subscribe((configs) => {
        this.integrationTabs[2].items = [...configs];
      }),
      clientDataStore.SelectMaterialImportConfigs().subscribe((configs) => {
        this.integrationTabs[3].items = [...configs];
      }),
      clientDataStore.SelectMaterialImportEvents().subscribe((importEvents) => {
        this.materialImportEvents = importEvents.sort(this.descBy('start'));
      }),
      clientDataStore.SelectScheduleSyncConfigs().subscribe((configs) => {
        console.log(configs);
        this.integrationTabs[6].items = [...configs];
      }),
      clientDataStore.SelectScheduleSyncEvents().subscribe((syncEvents) => {
        this.scheduleSyncEvents = syncEvents.sort(this.descBy('start'));
      }),
      clientDataStore.SelectCoilValidationConfigs().subscribe((configs) => {
        this.integrationTabs[4].items = [...configs];
      }),
      clientDataStore.SelectCoilValidationEvents().subscribe((coilValidationEvents) => {
        this.coilValidationEvents = coilValidationEvents.sort(this.descBy('receivedTime'));
      }),
      clientDataStore.SelectWebhookConfigs().subscribe((configs) => {
        this.integrationTabs[5].items = [...configs];
      }),
      clientDataStore.SelectWebhookEvents().subscribe((webhookEvents) => {
        this.webhookEvents = webhookEvents;
      }),
      clientDataStore.SelectExternalConnections().subscribe((connections) => {
        this.integrationTabs[7].items = [...connections];
      }),
    ];
  }

  descBy = <T>(key: keyof T) => {
    return (e1: T, e2: T) => (e1[key] > e2[key] ? -1 : e1[key] < e2[key] ? 1 : 0);
  };

  by = <T>(key: keyof T) => {
    return (e1: T, e2: T) => (e1[key] > e2[key] ? 1 : e1[key] < e2[key] ? -1 : 0);
  };

  onChangeTab(index) {
    this.router.navigate([], {
      queryParams: {tab: index},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  trackByKey = (index: number): any => {
    return index;
  };

  getKeys(val) {
    return Object.keys(val);
  }

  showModal(key, title, config = {}) {
    const dialogRef = this.dialog.open(AddConfigComponent, {
      width: '520px',
      data: {
        config,
        key,
        title,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('1232323232', result);
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }

  onAddConfig = (key: string, title: string) => {
    if (this.userHasAdminRole) {
      this.showModal(key, title);
    }
  };

  onEditConfig = (config, key: string, title: string) => {
    if (this.userHasAdminRole) {
      this.showModal(key, title, config);
    }
  };

  onRunConfig = (id: string) => {
    this.integrationService.runConfig(id);
  };

  onChangeEnable = (config, key, enabled) => {
    if (this.userHasAdminRole) {
      const newConfig = { ...config, enabled };
      this.integrationService.update(newConfig, key);
    }
  };

  ngOnDestroy(): void {
    this.subscriptions_.forEach((s) => s.unsubscribe());
  }
}
