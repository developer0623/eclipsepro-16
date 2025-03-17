import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAndonSequenceConfig, IAndonSequencePanel } from 'src/app/core/dto';

@Component({
  selector: 'app-edit-panel-dialog',
  templateUrl: './edit-panel-dialog.component.html',
  styleUrls: ['./edit-panel-dialog.component.scss'],
})
export class EditPanelDialogComponent {
  sequence: IAndonSequenceConfig;
  panel: IAndonSequencePanel;
  editKey: string;
  index: number = 0;
  timeUnitChoices = [
    { key: 'm', value: 'Minutes' },
    { key: 'h', value: 'Hours' },
  ];
  constructor(
    public dialogRef: MatDialogRef<EditPanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { sequence: IAndonSequenceConfig; index: number; editKey: string }
  ) {
    this.sequence = data.sequence;
    this.panel = this.sequence.panels[data.index];
    this.editKey = data.editKey;
    this.index = data.index;
  }

  cancel() {
    this.dialogRef.close(false);
  }
  savePanel() {
    this.sequence.panels[this.index] = this.panel;
    this.dialogRef.close(this.sequence);
  }
}
