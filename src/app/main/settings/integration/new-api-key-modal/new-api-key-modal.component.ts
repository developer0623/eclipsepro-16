import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { KeyDefinition } from '../types';
import { Ams } from 'src/app/amsconfig';

@Component({
  selector: 'app-new-api-key-modal',
  templateUrl: './new-api-key-modal.component.html',
  styleUrls: ['./new-api-key-modal.component.scss'],
})
export class NewApiKeyModalComponent {
  messages: string[] = [];
  description: string = '';
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<NewApiKeyModalComponent>) {}

  onSave() {
    console.log('click');
    this.http
      .post<KeyDefinition>(Ams.Config.BASE_URL + `/_api/apikeys/new`, {
        description: this.description,
        claims: ['api'],
      })
      .subscribe({
        next: (data) => {
          this.dialogRef.close(data);
        },
        error: (e) => {
          this.messages = e.data.errors;
        },
      });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
