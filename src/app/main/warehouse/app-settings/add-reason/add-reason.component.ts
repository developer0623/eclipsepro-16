import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseService } from '../../../shared/services/warehouse.service';

@Component({
  selector: 'app-add-reason',
  templateUrl: './add-reason.component.html',
  styleUrls: ['./add-reason.component.scss'],
})
export class AddReasonComponent {
  reason: { codeSet: string; reason: string };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { codeSet: string },
    public dialogRef: MatDialogRef<AddReasonComponent>,
    private warehouseService: WarehouseService
  ) {
    this.reason = { codeSet: data.codeSet, reason: '' };
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  add(): void {
    if (this.reason.reason) {
      this.warehouseService.addReason(this.reason).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }
  }
}
