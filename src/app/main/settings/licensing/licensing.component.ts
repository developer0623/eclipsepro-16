import { Component, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Ams } from 'src/app/amsconfig';
import { selectLicenseVM } from '../../shared/services/store/licensing/selector';
import { AddLicenseDialogComponent } from './add-license-dialog/add-license-dialog.component';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-licensing',
  templateUrl: './licensing.component.html',
  styleUrls: ['./licensing.component.scss'],
})
export class LicensingComponent implements OnDestroy {
  license;
  panelIsOpen = false;

  subscriptions_: Subscription[] = [];
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private clientDataStore: ClientDataStore,
    private store: Store
  ) {
    this.subscriptions_ = [
      clientDataStore.SelectLicense().subscribe(), // not sure what this is doing

      this.store.select(selectLicenseVM).subscribe((l) => {
        this.license = l;
      }),
    ];
  }

  addLicenseFile() {
    const dialogRef = this.dialog.open(AddLicenseDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  triggerLicenseUpdate = () => {
    this.http.post<any>(Ams.Config.BASE_URL + `/api/license/checknow`, {}).subscribe({
      next: (data) => {},
      error: (error) => {},
    });
  };

  triggerSendInstallInfo = () => {
    this.http.post<any>(Ams.Config.BASE_URL + `/api/system/sendinstalldata`, {}).subscribe({
      next: (data) => {},
      error: (error) => {},
    });
  };

  ngOnDestroy(): void {
    this.subscriptions_.forEach((s) => s.unsubscribe());
  }
}
