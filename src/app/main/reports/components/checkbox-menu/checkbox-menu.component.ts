import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CheckboxMenuItem } from '../../report-type';

@Component({
  selector: 'app-checkbox-menu',
  templateUrl: './checkbox-menu.component.html',
  styleUrls: ['./checkbox-menu.component.scss'],
})
export class CheckboxMenuComponent implements OnChanges {
  @Input() subject = '';
  @Input() menuSubject = '';
  @Input() menuList: CheckboxMenuItem[] = [];
  @Input() small = false;
  @Output() onChange: EventEmitter<CheckboxMenuItem[]> = new EventEmitter<CheckboxMenuItem[]>();
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

  onClickItem(item, $event) {
    $event.stopPropagation();
    $event.preventDefault();
    if (item.name === 'All') {
      this.allItem.isChecked = !this.allItem.isChecked;
      this.checkedAllItems(this.allItem.isChecked);
    } else {
      item.isChecked = !item.isChecked;
      if (item.isChecked) {
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
    if (this.subject === 'MACHINES') {
      return this.selectedItemsCount;
    } else {
      if (this.selectedItemsCount === this.menuList.length) {
        return 'All';
      } else {
        return this.menuList
          .filter((menu) => menu.isChecked)
          .reduce((mainVal, currentVal, index) => {
            if (index === 0) {
              return `${currentVal.name}`;
            }
            return `${mainVal} & ${currentVal.name}`;
          }, '');
      }
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
