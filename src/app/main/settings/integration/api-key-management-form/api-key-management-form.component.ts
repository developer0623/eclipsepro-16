import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ams } from 'src/app/amsconfig';
import { KeyDefinition } from '../types';
import { NewApiKeyModalComponent } from '../new-api-key-modal/new-api-key-modal.component';

@Component({
  selector: 'app-api-key-management-form',
  templateUrl: './api-key-management-form.component.html',
  styleUrls: ['./api-key-management-form.component.scss'],
})
export class ApiKeyManagementFormComponent {
  apiKeys: KeyDefinition[] = [];

  constructor(public dialog: MatDialog, private http: HttpClient, private _snackBar: MatSnackBar) {
    this.http
      .get<KeyDefinition[]>(Ams.Config.BASE_URL + '/_api/apikeys')
      .subscribe((list: KeyDefinition[]) => {
        console.log('3333333', list);
        this.apiKeys = list;
      });
  }

  onCopyKeyString(key: KeyDefinition) {
    // Clipboard is only available in secure contexts. Dev environment, for example,
    // is not one of them. https://stackoverflow.com/a/51823007/947
    if (navigator.clipboard) {
      navigator.clipboard.writeText(key.key);
      this._snackBar.open('Key copied to your clipboard.', '', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }

  onDeleteKey(key: KeyDefinition) {
    this.http.delete(Ams.Config.BASE_URL + `/_api/${key.id}`).subscribe(() => {
      this.apiKeys = this.apiKeys.filter((k) => k.id !== key.id);
      this._snackBar.open('Key deleted.', '', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
      });
    });
  }

  onNewKey() {
    const dialogRef = this.dialog.open(NewApiKeyModalComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.apiKeys.push(result);
      } else {
        console.log('Bundler rule add action canceled');
      }
    });
  }
}
