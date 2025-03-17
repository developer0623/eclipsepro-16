import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { UnitsService } from 'src/app/main/shared/services/units.service';
import { PerformanceDataService } from 'src/app/main/shared/services/performance-data.service';
import { IfpmPlan, IPerformanceData } from 'src/app/core/dto';
import { PerformanceDialogComponent } from '../performance-dialog/performance-dialog.component';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss'],
})
export class TableCellComponent implements OnChanges {
  @Input() value: IfpmPlan[];
  @Input() origin: IPerformanceData;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() unit = '';
  @Input() index = 0;
  @Input() istool = false;
  @Input() state = false;
  @Output() onFocus = new EventEmitter<boolean>();
  minValue: number;
  maxValue: number;
  isEdit = false;

  oldValue: number;
  isFocus = false;

  constructor(
    private performanceData: PerformanceDataService,
    public unitsService: UnitsService,
    public dialog: MatDialog
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(PerformanceDialogComponent, {
      width: '600px',
      data: {
        prefix: this.prefix,
        suffix: this.suffix,
        origin: this.origin,
        istool: this.istool,
        index: this.index,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.performanceData.refreshData();
    });
  }

  onEdit = (ev) => {
    this.isEdit = ev;
  };

  getValue() {
    (this.value || []).forEach(
      (f) => (f.fpm = this.unitsService.getUserFromSystem(f.fpm, this.unit))
    );
    this.updateSummary();
  }

  updateSummary() {
    const v: { fpm }[] = this.value || [];
    this.minValue = _.minBy(v, 'fpm').fpm;
    this.maxValue = _.maxBy(v, 'fpm').fpm;
    if (this.value.length > 1) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }
  }

  apiCall() {
    let data = {
      machineNumber: this.origin.machineNumber,
      toolingId: null,
      field: `${this.prefix}${this.suffix}`,
      value: this.value.map((x) => ({
        ...x,
        fpm: this.unitsService.getSystemFromUser(x.fpm, 'ft'),
      })),
    };
    if (this.istool) {
      data.toolingId = this.origin.toolings[this.index].toolingId;
    }
    this.performanceData.updateValue(data);
  }

  focus(state) {
    if (state) {
      this.oldValue = this.value[0].fpm;
    } else if (this.oldValue !== this.value[0].fpm) {
      this.apiCall();
    }
    setTimeout(() => {
      this.isFocus = state;
      // this.onFocus({ state: state });
    }, 200);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.value && changes.value.currentValue) {
      this.getValue();
    }
  }
}
