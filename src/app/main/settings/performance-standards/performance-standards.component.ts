import { Component, OnInit } from '@angular/core';
import { PerformanceDataService } from '../../shared/services/performance-data.service';

@Component({
  selector: 'app-performance-standards',
  templateUrl: './performance-standards.component.html',
  styleUrls: ['./performance-standards.component.scss'],
})
export class PerformanceStandardsComponent implements OnInit {
  focusedIndex = 0;
  constructor(public performanceData: PerformanceDataService) {}

  focused(index) {
    this.focusedIndex = index;
  }

  getOpacityItem(index) {
    if (
      this.performanceData.previousIndex !== null &&
      index !== this.performanceData.previousIndex
    ) {
      return true;
    }

    if (this.focusedIndex !== index && this.focusedIndex !== null) {
      return true;
    }

    return false;
  }

  ngOnInit(): void {
    this.performanceData.refreshData();
  }
}
