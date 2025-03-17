import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UnitsService } from 'src/app/main/shared/services/units.service';
import { PerformanceDataService } from 'src/app/main/shared/services/performance-data.service';
import { IfpmPlan, IPerformanceData } from 'src/app/core/dto';

@Component({
  selector: 'app-table-default-cell',
  templateUrl: './table-default-cell.component.html',
  styleUrls: ['./table-default-cell.component.scss'],
})
export class TableDefaultCellComponent implements OnInit {
  @Input() value: number;
  @Input() origin: IPerformanceData;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() unit = '';
  @Input() index = 0;
  @Input() istool = false;
  @Input() state = false;
  @Output() onFocus = new EventEmitter<boolean>();
  isFocus = false;
  oldValue: number;

  constructor(
    private performanceData: PerformanceDataService,
    private unitsService: UnitsService
  ) {}

  apiCall = () => {
    let data = {
      machineNumber: this.origin.machineNumber,
      toolingId: null,
      field: `${this.prefix}${this.suffix}`,
      value: this.unitsService.getSystemFromUser(this.value, this.unit),
    };
    if (this.istool) {
      data.toolingId = this.origin.toolings[this.index].toolingId;
    }
    this.performanceData.updateValue(data);
  };

  focus = (state) => {
    if (state) {
      this.oldValue = this.value;
    } else if (this.oldValue !== this.value) {
      this.apiCall();
    }
    setTimeout(() => {
      this.isFocus = state;
      // this.onFocus({ state: state });
    }, 100);
  };

  ngOnInit(): void {
    this.value = this.unitsService.getUserFromSystem(this.value, this.unit);
  }
}
