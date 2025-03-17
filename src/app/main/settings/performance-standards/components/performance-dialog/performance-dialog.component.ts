import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PerformanceDataService } from 'src/app/main/shared/services/performance-data.service';
import { UnitsService } from 'src/app/main/shared/services/units.service';
import { IfpmPlan, IPerformanceData } from 'src/app/core/dto';

@Component({
  selector: 'app-performance-dialog',
  templateUrl: './performance-dialog.component.html',
  styleUrls: ['./performance-dialog.component.scss'],
})
export class PerformanceDialogComponent implements OnInit {
  prefix = '';
  suffix = '';
  origin: IPerformanceData;
  istool = false;
  index = 0;
  categories = [
    { title: 'Planning', value: 'Plan' },
    { title: 'Target', value: 'Target' },
  ];
  styles = [
    { id: 0, value: 'SINGLE VALUE' },
    { id: 1, value: 'LENGTH BASED' },
  ];
  selectedStyle = 0;
  value: IfpmPlan[];
  selectedCategory = this.categories[0];
  isShowSingle = false;
  isChart = false;
  selectedTabIndex = 0;

  constructor(
    private performanceData: PerformanceDataService,
    public unitsService: UnitsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      prefix: string;
      suffix: string;
      origin: IPerformanceData;
      istool: boolean;
      index: number;
    }
  ) {
    this.prefix = data.prefix;
    this.suffix = data.suffix;
    this.origin = data.origin;
    this.istool = data.istool;
    if (this.istool) {
      this.index = data.index;
      this.selectedTabIndex = 1;
    }

    if (this.suffix === 'Plan') {
      this.selectedCategory = this.categories[0];
    } else {
      this.selectedCategory = this.categories[1];
    }
  }

  setStyle() {
    if (this.value.length > 1) {
      this.selectedStyle = 1;
      this.isShowSingle = false;
    } else {
      this.selectedStyle = 0;
      this.isShowSingle = true;
    }
  }

  getValue() {
    if (this.selectedTabIndex) {
      this.value = this.origin.toolings[this.index][`${this.prefix}${this.suffix}`];
    } else {
      this.value = this.origin.default[`${this.prefix}${this.suffix}`];
    }
  }

  apiCall() {
    let data = {
      machineNumber: this.origin.machineNumber,
      toolingId: null,
      field: `${this.prefix}${this.suffix}`,
      value: this.value.map((v) => ({
        ...v,
        fpm: this.unitsService.getSystemFromUser(v.fpm, 'ft'),
      })),
    };
    if (this.selectedTabIndex) {
      data.toolingId = this.origin.toolings[this.index].toolingId;
    }
    this.performanceData.updateValue(data);
  }

  addValue() {
    let item = { lengthIn: 0, fpm: 0 };
    this.value.push(item);
    if (this.value.length > 1) {
      this.isShowSingle = false;
    }
    this.apiCall();
  }

  onClickCategoryItem = (ev, item) => {
    this.suffix = item.value;
    this.selectedCategory = item;
    this.getValue();
    this.setStyle();
  };

  onRemoveItem = (index) => {
    this.value.splice(index, 1);
  };

  onValueChanged() {
    this.value = _.orderBy(this.value, ['lengthIn']);
    this.apiCall();
  }

  onTabSelected(ev) {
    this.selectedTabIndex = ev;
    this.getValue();
    this.setStyle();
  }

  onClickToolItem = (item, index) => {
    this.index = index;
    this.getValue();
    this.setStyle();
  };

  changeStyle() {}

  ngOnInit(): void {
    this.getValue();
    this.setStyle();
  }
}
