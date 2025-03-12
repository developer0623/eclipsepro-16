import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WarehouseService } from '../../../shared/services/warehouse.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent {
  location: { category: string; name: string };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: string },
    public dialogRef: MatDialogRef<AddLocationComponent>,
    private warehouseService: WarehouseService
  ) {
    this.location = { category: data.category, name: '' };
  }

  cancel(): void {
    this.dialogRef.close();
  }

  add(): void {
    if (this.location.name) {
      this.warehouseService.addLocation(this.location).subscribe((result) => {
        this.dialogRef.close(result);
      });
    }
  }
}
