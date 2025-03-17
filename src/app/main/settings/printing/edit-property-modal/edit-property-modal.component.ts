import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-property-modal',
  templateUrl: './edit-property-modal.component.html',
  styleUrls: ['./edit-property-modal.component.scss'],
})
export class EditPropertyModalComponent {
  properties = [];
  mainType = '';

  constructor(
    public dialogRef: MatDialogRef<EditPropertyModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: string;
      properties: Object;
    }
  ) {
    this.properties = Object.keys(data.properties).map((item) => {
      return {
        key: item,
        value: data.properties[item],
      };
    });
    this.mainType = data.type;
  }

  addProperty() {
    const newProperty = {
      key: '',
      value: '',
    };
    this.properties = [...this.properties, newProperty];
  }

  deletePorpery(index) {
    this.properties.splice(index, 1);
  }

  onChangeDetail(val, type, index) {
    this.properties[index] = {
      ...this.properties[index],
      [type]: val,
    };
  }

  save() {
    let objProperties = {};
    this.properties.forEach((item) => {
      if (item.key) {
        objProperties = {
          ...objProperties,
          [item.key]: item.value,
        };
      }
    });
    this.dialogRef.close(objProperties);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
