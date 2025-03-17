import { Component, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, combineLatestWith, map } from 'rxjs/operators';
import { IMachinePrintConfig, IInstalledPrinters, IRecentBundleResult } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
import { EditPropertyModalComponent } from './edit-property-modal/edit-property-modal.component';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { putAction } from '../../shared/services/clientData.actions';

@Component({
  selector: 'app-printing',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.scss'],
})
export class PrintingComponent implements OnDestroy {
  installedPrinters: IInstalledPrinters = { printers: [] };
  allPrinters: {
    id: string;
    name: string;
    fullName: string;
    description: string;
  }[];
  printTemplates = [];
  machinePrintConfigs: (IMachinePrintConfig & { machineName: string })[] = [];
  selectedTabIndex = 0;
  bundlePrintConfig = {
    bundleTagEnabled: false,
    bundleTagProperties: {},
    bundleTagStartingDate: new Date(),
    isConfigured: false,
    messages: [],
    source: undefined,
  };
  coilPrintConfig = {
    coilTagEnabled: false,
    coilTagProperties: {},
    coilTagStartingDate: new Date(),
    isConfigured: false,
    messages: [],
    defaultTemplate: '',
  };
  files = [];
  recentBundles: IRecentBundleResult[];
  bundleCompletionAlgorithms = ['None', 'Job', 'Controller'].map((x) => ({
    title: x,
    translationKey: 'BundleCompletionAlgorithm' + x,
  }));

  loading = false;
  hideComplete = false;
  subscriptions_: Subscription[] = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private clientDataStore: ClientDataStore
  ) {
    this.selectedTabIndex = Number(this.route.snapshot.paramMap.get('tab')) || 0;

    let NOTEMPTY = (x: []) => x.length > 0;
    this.subscriptions_ = [
      clientDataStore.SelectPrintTemplates().subscribe((templates) => {
        this.printTemplates = templates.map((t) => ({
          ...t,
          previewUrl:
            '/_api/printing/printTemplates/' +
            t.name +
            '/preview?output=png&cachebuster=' +
            (Math.random() * 1000).toString(),
        }));
      }),
      clientDataStore
        .SelectMachinePrintConfigs()
        .pipe(
          combineLatestWith(clientDataStore.SelectMachines()),
          filter(
            ([machineConfigs, machines]) => machineConfigs?.length > 0 && machines?.length > 0
          ), // Prevents unnecessary execution
          map(([machineConfigs, machines]) => ({
            machineConfigs,
            machines,
          }))
        )
        .subscribe(({ machineConfigs, machines }) => {
          this.machinePrintConfigs = machines.map((machine) => {
            let printConfig = machineConfigs.find((mp) => mp.id === machine.id);
            return { ...printConfig, machineName: machine.description };
          });
          this.updateAllPrinters();
        }),

      clientDataStore.SelectInstalledPrinters().subscribe((printers) => {
        this.installedPrinters = printers;
        this.updateAllPrinters();
      }),

      clientDataStore.SelectRecentBundles().subscribe((recentBundles) => {
        this.recentBundles = _.orderBy(recentBundles, ['complete', 'endTime'], ['desc', 'desc']);
      }),
    ];

    this.getBundlePrintConfig();
    this.getCoilPrintConfig();
  }

  private saveError(error) {
    console.error(error);
    this.toast('Unable to save settings');
  }

  private saveBundleConfigSuccess(data) {
    this.bundlePrintConfig = data;
    this.toast('Settings updated');
  }

  saveBundleTagEnabled() {
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/printing/bundlePrintConfig`, {
        bundleTagEnabled: this.bundlePrintConfig.bundleTagEnabled,
      })
      .subscribe({
        next: (data) => {
          this.saveBundleConfigSuccess(data);
        },
        error: (e) => {
          this.saveError(e);
        },
      });
  }

  setBundleCompletionAlgorithm(algorithm) {
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/printing/bundlePrintConfig`, {
        source: algorithm.title,
      })
      .subscribe({
        next: (data) => {
          this.saveBundleConfigSuccess(data);
        },
        error: (e) => {
          this.saveError(e);
        },
      });
  }

  saveCoilConfigSuccess(data) {
    this.coilPrintConfig = data;
    this.toast('Settings updated');
  }

  saveCoilTagEnabled() {
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/printing/coilPrintConfig`, {
        coilTagEnabled: this.coilPrintConfig.coilTagEnabled,
      })
      .subscribe({
        next: (data) => {
          this.saveCoilConfigSuccess(data);
        },
        error: (e) => {
          this.saveError(e);
        },
      });
  }

  saveBundlePrintStartDate() {
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/printing/bundlePrintConfig`, {
        startingDate: this.bundlePrintConfig.bundleTagStartingDate,
      })
      .subscribe({
        next: (data) => {
          this.saveBundleConfigSuccess(data);
        },
        error: (e) => {
          this.saveError(e);
        },
      });
  }

  saveCoilPrintStartDate() {
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/printing/coilPrintConfig`, {
        coilTagStartingDate: this.coilPrintConfig.coilTagStartingDate,
      })
      .subscribe({
        next: (data) => {
          this.saveCoilConfigSuccess(data);
        },
        error: (e) => {
          this.saveError(e);
        },
      });
  }

  saveCoilDefaultTemplate() {
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/printing/coilPrintConfig`, {
        defaultTemplate: this.coilPrintConfig.defaultTemplate,
      })
      .subscribe({
        next: (data) => {
          this.saveCoilConfigSuccess(data);
        },
        error: (e) => {
          this.saveError(e);
        },
      });
  }

  updateMachineConfig(config: IMachinePrintConfig) {
    this.http
      .post(`${Ams.Config.BASE_URL}/_api/printing/machinePrintConfigs?id=${config.id}`, config)
      .subscribe({
        next: (data) => {
          this.toast('Your changes have been saved.');
        },
        error: (e) => {
          this.toast(`Error! Your changes have not been saved.${e.error.errors.join('\n')}`);
        },
      });
  }

  filterHideComplete(item: { complete: boolean }) {
    return !this.hideComplete || !item.complete;
  }

  onTemplateUpload(event) {
    const file: File = event.target.files[0];
    if (file) {
      let payload = new FormData();
      payload.append('file', file, file.name);
      this.http.put(`${Ams.Config.BASE_URL}/_api/printing/printTemplates`, payload).subscribe({
        next: () => {
          this.http.get(`${Ams.Config.BASE_URL}/_api/printing/printTemplates`).subscribe({
            next: (data: any[]) => {
              data.forEach((x) =>
                this.store.dispatch(putAction({ collection: 'PrintTemplates', payload: x }))
              );
            },
            error: (e) => {
              this.toast('Unable to refresh the template data. \n' + e.error);
            },
          });
          return this.toast('Template successfully added.');
        },
        error: (e) => {
          this.toast('Template import failed.\n' + e.error.errors.join('\n'));
        },
      });
    } else {
      this.toast('No template file was selected.');
    }
  }

  printBundle(bundleCode: string) {
    this.http.post<string>(`${Ams.Config.BASE_URL}/_api/bundle/${bundleCode}/print`, {}).subscribe({
      next: (data) => {
        this.toast(data);
      },
      error: (e) => {
        this.toast(`Print failed.\n${e.error.errors.join('\n')}`);
      },
    });
  }

  updateAllPrinters() {
    const unknownPrinters = this.machinePrintConfigs
      .filter(
        (machine) =>
          // Has a configured printer...
          machine.bundlePrinterName &&
          // ...but said printer is not in our list.
          !this.installedPrinters.printers.find((p) => p.fullName === machine.bundlePrinterName)
      )
      .map((p) => {
        return {
          id: p.bundlePrinterName,
          name: 'Error:' + p.bundlePrinterName,
          fullName: p.bundlePrinterName,
          description: '<not installed>',
        };
      })
      // Removes duplicate entries. Like a distinct.
      .filter((value, index, self) => self.findIndex((v) => v.name === value.name) === index);

    this.allPrinters = unknownPrinters.concat(this.installedPrinters.printers);
  }

  isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  private getBundlePrintConfig() {
    this.http
      .get<typeof this.bundlePrintConfig>(Ams.Config.BASE_URL + '/_api/printing/bundlePrintConfig')
      .subscribe((data) => {
        this.bundlePrintConfig = data;
      });
  }

  private getCoilPrintConfig() {
    this.http
      .get<typeof this.coilPrintConfig>(Ams.Config.BASE_URL + '/_api/printing/coilPrintConfig')
      .subscribe((data) => {
        this.coilPrintConfig = data;
      });
  }

  editProperty(type: string) {
    const properties =
      type === 'coil'
        ? this.coilPrintConfig.coilTagProperties
        : this.bundlePrintConfig.bundleTagProperties;
    const dialogRef = this.dialog.open(EditPropertyModalComponent, {
      width: '500px',
      data: {
        type,
        properties,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (type === 'coil') {
          const props = { coilTagProperties: result };
          this.http.post(`${Ams.Config.BASE_URL}/_api/printing/coilPrintConfig`, props).subscribe({
            next: (data) => {
              this.toast('Settings updated');
            },
            error: (e) => {
              this.saveError(e);
            },
          });
          this.coilPrintConfig = {
            ...this.coilPrintConfig,
            ...props,
          };
        } else {
          const props = { bundleTagProperties: result };
          this.http
            .post(`${Ams.Config.BASE_URL}/_api/printing/bundlePrintConfig`, props)
            .subscribe({
              next: (data) => {
                this.toast('Settings updated');
              },
              error: (e) => {
                this.saveError(e);
              },
            });
          this.bundlePrintConfig = {
            ...this.bundlePrintConfig,
            ...props,
          };
        }
      }
    });
  }

  getKeys(val) {
    return Object.keys(val);
  }

  onChangeTab(index) {
    this.router.navigate([], {
      queryParams: {tab: index},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private toast(textContent: string) {
    this._snackBar.open(textContent, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((sub) => sub.unsubscribe());
  }
}
