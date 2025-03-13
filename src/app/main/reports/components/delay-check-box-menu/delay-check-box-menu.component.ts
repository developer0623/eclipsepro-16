import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

interface DelayCode {
  category: string;
  code: string;
  name: string;
  description: string;
  isChecked?: boolean;
}

@Component({
  selector: 'app-delay-check-box-menu',
  templateUrl: './delay-check-box-menu.component.html',
  styleUrls: ['./delay-check-box-menu.component.scss'],
})
export class DelayCheckBoxMenuComponent implements OnChanges {
  @Input() subject = '';
  @Input() menuSubject = '';
  @Input() menuList: DelayCode[] = [];
  @Output() onChange: EventEmitter<DelayCode[]> = new EventEmitter<DelayCode[]>();
  selectedItemsCount = 0;
  mainTitle: string = 'All';
  allItem: { name: string; isChecked: boolean } = {
    name: 'All',
    isChecked: true,
  };

  initItems() {
    this.selectedItemsCount = this.menuList.filter((m) => m.isChecked).length;
    this.allItem = {
      ...this.allItem,
      isChecked: this.selectedItemsCount === this.menuList.length,
    };
  }

  onClickGroupHeader($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  onClickItem(item, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    if (item.name === 'All') {
      this.allItem.isChecked = !this.allItem.isChecked;
      this.checkedAllItems(this.allItem.isChecked);
    } else {
      const findItem = this.menuList.find((m) => m.code === item.code);
      findItem.isChecked = !findItem.isChecked;
      if (findItem.isChecked) {
        this.selectedItemsCount++;
      } else {
        this.selectedItemsCount--;
      }

      this.allItem.isChecked = this.selectedItemsCount === this.menuList.length;
    }
    this.menuList = [...this.menuList];
    this.onChange.emit(this.menuList);
  }

  isAllIndeterminate() {
    if (this.selectedItemsCount > 0 && this.selectedItemsCount < this.menuList.length) {
      return true;
    }
    return false;
  }

  checkedAllItems(flag) {
    this.menuList = this.menuList.map((item) => {
      return {
        ...item,
        isChecked: flag,
      };
    });
    if (flag) {
      this.selectedItemsCount = this.menuList.length;
    } else {
      this.selectedItemsCount = 0;
    }
  }

  onGetTitle() {
    if (this.selectedItemsCount === this.menuList.length) {
      return 'All';
    } else {
      return this.selectedItemsCount;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.menuList &&
      ((!changes.menuList.previousValue && changes.menuList.currentValue) ||
        (changes.menuList.currentValue &&
          changes.menuList.previousValue &&
          changes.menuList.currentValue.length !== changes.menuList.previousValue.length))
    ) {
      this.initItems();
    }
  }
}
