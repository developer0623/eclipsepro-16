import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ICoilDto, IPrintTemplate, IInstalledPrinters } from 'src/app/core/dto';
import { ClientDataStore } from '../../shared/services/clientData.store';
import { CoilTagPrintDialogComponent } from '../coil-tag-print-dialog/coil-tag-print-dialog.component';

@Component({
  selector: 'app-coil-detail',
  templateUrl: './coil-detail.component.html',
  styleUrls: ['./coil-detail.component.scss'],
})
export class CoilDetailComponent implements OnDestroy {
  coilId: string;
  coil: ICoilDto = {} as ICoilDto;
  printTemplates: IPrintTemplate[];
  printers: IInstalledPrinters;
  subscriptions_: Subscription[] = [];

  constructor(
    private clientDataStore: ClientDataStore,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.coilId = this.route.snapshot.paramMap.get('id');
    this.subscriptions_ = [
      clientDataStore
        .SelectCoilsIn({ property: 'coilId', values: [this.coilId] })
        .pipe(
          filter((coils) => coils.length > 0),
          map((coils) => coils.find((c) => c.coilId === this.coilId)),
          filter((ct) => !!ct)
        )
        .subscribe((coil) => {
          this.coil = coil;
        }),

      clientDataStore
        .SelectPrintTemplates()
        .pipe(
          // Filter templates by type 'Coil'
          map((templates) => templates.filter((x) => x.type === 'Coil'))
        )
        .subscribe((printTemplates) => {
          this.printTemplates = printTemplates;
        }),

      clientDataStore.SelectInstalledPrinters().subscribe((printers) => {
        this.printers = printers;
      }),
    ];
  }

  onPrintClick() {
    const dialogRef = this.dialog.open(CoilTagPrintDialogComponent, {
      width: '400px',
      data: {
        coilTags: this.printTemplates,
        printers: this.printers.printers,
        coil: this.coil,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBar.open(result, '', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions_.forEach((s) => s.unsubscribe());
  }
}
