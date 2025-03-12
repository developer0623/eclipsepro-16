import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Ams } from 'src/app/amsconfig';
import { ICoilDtoLocation, IMaterialDto } from 'src/app/core/dto';
import { ClientDataStore } from '../../shared/services/clientData.store';

@Component({
  selector: 'app-material-edit-dialog',
  templateUrl: './material-edit-dialog.component.html',
  styleUrls: ['./material-edit-dialog.component.scss'],
})
export class MaterialEditDialogComponent implements OnDestroy {
  coilType: IMaterialDto = {} as IMaterialDto;
  materialColors: string[] = [];
  materialTypes: string[] = [];
  subscriptions_: Subscription[] = [];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<MaterialEditDialogComponent>,
    private clientDataStore: ClientDataStore,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      coilType: IMaterialDto;
    }
  ) {
    this.coilType = data.coilType;
    this.subscriptions_ = [
      clientDataStore.SelectMaterialTypes().subscribe((types) => {
        this.materialTypes = types.map((item) => item.type);
      }),
      clientDataStore.SelectMaterialColors().subscribe((colors) => {
        this.materialColors = colors.map((item) => item.color);
      }),
    ];
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  save() {
    this.http
      .put(`${Ams.Config.BASE_URL}/api/material/${this.coilType.id}`, this.coilType)
      .subscribe({
        next: () => {
          this.dialogRef.close(this.coilType);
        },
        error: (error) => {
          console.log('error-----', error);
        },
      });
  }

  queryColorSearch(searchText) {
    let colors = this.materialColors.filter((color) =>
      color.toLowerCase().includes(searchText?.trim().toLowerCase())
    );
    return colors;
  }
  queryTypeSearch(searchText) {
    let types = this.materialTypes.filter((type) =>
      type.toLowerCase().includes(searchText?.trim().toLowerCase())
    );
    return types;
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((s) => s.unsubscribe());
  }
}
