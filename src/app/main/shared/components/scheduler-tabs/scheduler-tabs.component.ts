import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

import { IMetricDefinition, IDashboardMachine, IMachine } from 'src/app/core/dto';

@Component({
  selector: 'app-scheduler-tabs',
  templateUrl: './scheduler-tabs.component.html',
  styleUrls: ['./scheduler-tabs.component.scss'],
})
export class SchedulerTabsComponent implements OnChanges {
  @Input() metricDefinitions: { [index: string]: IMetricDefinition };
  @Input() dashboardMachines: IDashboardMachine[] = [];
  @Input() selectedTabIndex = 0;
  @Input() isInitMove = false;
  @Output() onChangeTab: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;

  trackByKey = (index: number, m: IMachine): number => {
    return m.id;
  };

  selectedTabChange() {
    this.selectedTabIndex = this.tabGroup.selectedIndex;
    this.centerSelectedTab();
    this.onChangeTab.emit(this.selectedTabIndex);
  }

  centerSelectedTab() {
    const tabHeader = this.tabGroup._tabHeader;
    const tabList = tabHeader._tabList.nativeElement;
    const tabElement = tabList.children[0].children[this.selectedTabIndex];
    const tabWidth = tabElement.offsetWidth;
    const screenWidth = this.tabGroup._tabHeader._tabListContainer.nativeElement.clientWidth;

    const scrollAmount = tabElement.offsetLeft + tabWidth / 2 - screenWidth / 2;
    tabHeader.scrollDistance = scrollAmount;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.isInitMove &&
      !changes.isInitMove.previousValue &&
      changes.isInitMove.currentValue
    ) {
      this.centerSelectedTab();
    }
  }
}
