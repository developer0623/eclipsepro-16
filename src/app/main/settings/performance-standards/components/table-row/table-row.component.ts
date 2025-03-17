import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UnitsService } from 'src/app/main/shared/services/units.service';
import { PerformanceDataService } from 'src/app/main/shared/services/performance-data.service';
import { IPerformanceDataDefault, IPerformanceData, IPerformanceDataTool } from 'src/app/core/dto';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss'],
})
export class TableRowComponent {
  @Input() item: IPerformanceDataDefault = { overrideMachine: false } as IPerformanceDataDefault;
  @Input() origin: IPerformanceData;
  @Input() istool = false;
  @Input() index = 0;
  @Input() machinenum = 0;
  @Input() parentval: IPerformanceDataDefault;
  @Output() onFocused = new EventEmitter<number | null>();

  isEdit = false;
  focused = false;
  previousValue;
  selectedElement;

  constructor(
    private performanceData: PerformanceDataService,
    private unitsService: UnitsService
  ) {}

  onExpand() {
    this.performanceData.changeStatus(this.index);
  }

  getChecked() {
    return this.performanceData.getStatus(this.index);
  }

  onFocus = (ev) => {
    this.isEdit = ev;
  };

  saveOverride(e, item) {
    let data = {
      machineNumber: this.origin.machineNumber,
      toolingId: this.origin.toolings[this.index].toolingId,
      field: `overrideMachine`,
      value: e.checked,
    };
    item.overrideMachine = e.checked;
    this.performanceData.updateValue(data);
    this.getCount();
  }

  compareParent(fieldKey: string) {
    // let keyFlag = false;

    if (this.parentval && this.item[fieldKey] !== this.parentval[fieldKey]) {
      return true;
    }
    return false;
  }

  destroyFocus(element) {
    let editedValue = element.target.value;
    this.focused = false;
    // if(previousValue !== editedValue) {
    //     selectedElement.className += " edited";
    // }
    if (this.index !== null) {
      this.onFocused.emit(null);
    }
  }

  focusSelect(element) {
    let input = element.target;
    this.previousValue = element.target.value;
    setTimeout(() => {
      input.select();
    }, 0);

    this.selectedElement = input;

    this.focused = true;
    if (this.index !== null) {
      this.onFocused.emit(this.index);
    }
  }

  compareHistorical(mainValue, hisValue) {
    let myStyle;
    if (mainValue >= hisValue) {
      myStyle = { 'background-color': 'transparent' };
    } else if (mainValue < hisValue / 2) {
      myStyle = { 'background-color': 'red' };
    } else {
      myStyle = { 'background-color': 'yellow' };
    }
    return myStyle;
  }

  getCount() {
    let count = this.performanceData.getCount(this.index);
    let value = '';
    return value + count.unChecked + '/' + count.total;
  }
}
