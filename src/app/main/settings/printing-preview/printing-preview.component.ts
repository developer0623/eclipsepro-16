import { Component, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router  } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { Ams } from 'src/app/amsconfig';
import { IRecentBundleResult } from 'src/app/core/dto';
import { putAction } from '../../shared/services/clientData.actions';

interface TemplateDef {
  name: string;
  previewUrl: string;
  type?: string;
  pageHeightIn?: number;
  pageWidthIn?: number;
}

@Component({
  selector: 'app-printing-preview',
  templateUrl: './printing-preview.component.html',
  styleUrls: ['./printing-preview.component.scss'],
})
export class PrintingPreviewComponent implements OnDestroy {
  printTemplates = [];
  selectedTemplate: TemplateDef = { name: '', previewUrl: '' };
  files = [];
  loading = false;
  //previewBaseUrl = 'http://localhost:8080';
  previewBaseUrl = '';
  recentBundles: IRecentBundleResult[];
  selectedBundleCode = '';
  subscriptions_: Subscription[] = [];
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private clientDataStore: ClientDataStore
  ) {
    const template = this.route.snapshot.paramMap.get('template') || '';
    this.selectedTemplate = {
      name: template,
      previewUrl: this.generatePreviewUrl(template),
    };

    this.subscriptions_ = [
      this.clientDataStore.SelectPrintTemplates().subscribe((templates) => {
        this.printTemplates = templates.map((t) => ({
          ...t,
          previewUrl: this.generatePreviewUrl(t.name),
        }));
        if (this.selectedTemplate?.name) {
          let found = this.printTemplates.findIndex((t) => t.name === this.selectedTemplate.name);
          if (found > -1) {
            this.selectedTemplate = this.printTemplates[found];
          }
        }
      }),

      clientDataStore.SelectRecentBundles().subscribe((recentBundles) => {
        this.recentBundles = _.orderBy(recentBundles, ['complete', 'endTime'], ['desc', 'desc']);
      }),
    ];
  }

  generatePreviewUrl(templateName: string): string {
    return (
      `${this.previewBaseUrl}/_api/printing/printTemplates/` +
      templateName +
      '/preview?output=png&cachebuster=' +
      (Math.random() * 1000).toString() +
      (this.selectedBundleCode !== '' ? `&bundleCode=${this.selectedBundleCode}` : '')
    );
  }

  onUpdatePreview() {
    this.selectedTemplate.previewUrl = this.generatePreviewUrl(this.selectedTemplate.name);
  }

  onTemplateUpload(event) {
    const file: File = event.target.files[0];
    if (file) {
      let payload = new FormData();
      payload.append('file', file);
      this.http
        .post(`${Ams.Config.BASE_URL}/_api/printing/printTemplates`, { data: payload })
        .subscribe({
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
