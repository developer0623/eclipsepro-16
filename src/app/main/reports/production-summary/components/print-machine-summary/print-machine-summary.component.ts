import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-print-machine-summary',
  templateUrl: './print-machine-summary.component.html',
  styleUrls: ['./print-machine-summary.component.scss'],
})
export class PrintMachineSummaryComponent {
  @Input() machine: string = '';
  @Input() data;
}
