import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IMaterialDto, ToolingDef } from 'src/app/core/dto';
import { Ams } from 'src/app/amsconfig';
declare let gtag;

@Component({
  selector: 'app-order-def-change-dialog',
  templateUrl: './order-def-change-dialog.component.html',
  styleUrls: ['./order-def-change-dialog.component.scss'],
})
export class OrderDefChangeDialogComponent {
  errors: string[] = [];
  materials: IMaterialDto[] = [];
  toolings: ToolingDef[] = [];
  selectedMaterial: IMaterialDto = {} as IMaterialDto;
  selectedTooling: ToolingDef = {} as ToolingDef;

  ordId: number;
  orderCode: string;
  materialCode: string;
  toolingCode: string;
  orderControl = new FormControl('');
  materialControl = new FormControl('');
  filteredMaterials$: Observable<IMaterialDto[]>;
  toolControl = new FormControl('');
  filteredTools$: Observable<ToolingDef[]>;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<OrderDefChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      ordId: number;
      orderCode: string;
      materialCode: string;
      toolingCode: string;
    }
  ) {
    this.ordId = data.ordId;
    this.orderCode = data.orderCode;
    this.materialCode = data.materialCode;
    this.toolingCode = data.toolingCode;
    this.orderControl.setValue(this.orderCode);
    // todo: we should be paging this data. 4000 is way more than enough, but I'm sure someone will be crazy an have even more.
    this.http
      .get<IMaterialDto[]>(`${Ams.Config.BASE_URL}/api/material?skip=0&take=4000&type=ALL`)
      .subscribe((result) => {
        this.materials = result.sort((a, b) => a.materialCode.localeCompare(b.materialCode));
        this.selectedMaterial = this.materials.find((m) => m.materialCode === this.materialCode);
        if (this.selectedMaterial) {
          this.materialControl.setValue(this.materialCode);
        }
      });
    this.http
      .get<ToolingDef[]>(`${Ams.Config.BASE_URL}/_api/tooling?skip=0&take=4000&type=ALL`)
      .subscribe((result) => {
        this.toolings = result.sort((a, b) => a.toolingCode.localeCompare(b.toolingCode));
        this.selectedTooling = this.toolings.find((t) => t.toolingCode === this.toolingCode);
        if (this.selectedTooling) {
          this.toolControl.setValue(this.toolingCode);
        }
      });
  }

  onMaterialSelectionChange(ma) {
    this.selectedMaterial = ma;
    this.errors = [];
    if (!this.selectedMaterial) {
      this.errors.push('Material not recognized.');
      return;
    }
  }

  onToolingSelectionChange(tool) {
    this.selectedTooling = tool;
    this.errors = [];
    if (!this.selectedTooling) {
      this.errors.push('Tooling not recognized.');
      return;
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  save() {
    if (!this.selectedMaterial) {
      this.errors.push('Choose a material.');
      return;
    }

    if (!this.selectedTooling) {
      this.errors.push('Choose a tooling.');
      return;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post<{ ordId: number }>(
        `${Ams.Config.BASE_URL}/api/ordercommand/changedef`,
        {
          ordId: this.ordId,
          orderCode: this.orderControl.value,
          materialCode: this.selectedMaterial.materialCode,
          toolingCode: this.selectedTooling.toolingCode,
        },
        httpOptions
      )
      .subscribe({
        next: (data) => {
          gtag('event', 'orderDetail_changeDef', {
            event_category: 'orderDetail',
            event_label: 'rebundle/changeDef',
            value: 1,
          });
          this.dialogRef.close('success');
        },
        error: (e) => {
          this.errors = e.error.errors;
        },
      });
  }

  ngOnInit() {
    this.filteredMaterials$ = this.materialControl.valueChanges.pipe(
      startWith(''),
      map((ma) => (ma ? this.searchMaterialFilter(ma) : this.materials.slice()))
    );

    this.filteredTools$ = this.toolControl.valueChanges.pipe(
      startWith(''),
      map((to) => (to ? this.searchToolFilter(to) : this.toolings.slice()))
    );
  }

  private searchMaterialFilter(value: string): IMaterialDto[] {
    const filterValue = value.toLowerCase();
    return this.materials.filter(
      (ma) =>
        ma.materialCode.toLowerCase().includes(filterValue) ||
        ma.description.toLowerCase().includes(filterValue)
    );
  }

  private searchToolFilter(value: string): ToolingDef[] {
    const filterValue = value.toLowerCase();
    return this.toolings.filter(
      (to) =>
        to.toolingCode.toLowerCase().includes(filterValue) ||
        to.description.toLowerCase().includes(filterValue)
    );
  }
}
