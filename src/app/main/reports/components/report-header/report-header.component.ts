import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
})
export class ReportHeaderComponent {
  @Input('subject') subject = '';
  @Output() onFilter: EventEmitter<number | string> = new EventEmitter<number | string>();
  searchTxt: string = '';
  isOpenFilter = false;
  focusInput = false;

  onOpenFilter() {
    this.isOpenFilter = true;
    this.focusInput = true;
  }

  onCloseFilter() {
    this.isOpenFilter = false;
    this.focusInput = false;
  }

  onChange() {
    this.onFilter.emit(this.searchTxt);
  }
}
