import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IMachineTools } from 'src/app/core/dto';

@Component({
  selector: 'app-add-machine-modal',
  templateUrl: './add-machine-modal.component.html',
  styleUrls: ['./add-machine-modal.component.scss'],
})
export class AddMachineModalComponent {
  machines: IMachineTools[] = [];
  selectedMachine: number = 0;
  constructor(
    public dialogRef: MatDialogRef<AddMachineModalComponent>,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      machines: IMachineTools[];
    }
  ) {
    this.machines = data.machines;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  save() {
    this.dialogRef.close(this.selectedMachine);
  }
}
