import { Component, Input } from '@angular/core';
import { IDashboardMachine } from 'src/app/core/dto';

@Component({
  selector: 'app-andon-display',
  templateUrl: './andon-display.component.html',
  styleUrls: ['./andon-display.component.scss'],
})
export class AndonDisplayComponent {
  @Input() sequence;
  @Input() machine: IDashboardMachine;
  @Input() metricDefinitions;
  @Input() currTask;
  @Input() currentJob;
  @Input() currentItem;
  @Input() viewKey: string;
  @Input() playKey: string;
  @Input() theme;
  @Input() display: string;
  @Input() coilType;
}
