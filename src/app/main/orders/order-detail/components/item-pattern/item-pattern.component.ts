import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IJobItem } from 'src/app/core/dto';

@Component({
  selector: 'app-item-pattern',
  templateUrl: './item-pattern.component.html',
  styleUrls: ['./item-pattern.component.scss'],
})
export class ItemPatternComponent {
  @Input() item: IJobItem = {} as IJobItem;
  @Input() pendingSave = false;
  @Output() createPattern = new EventEmitter<string>();
  @Output() updatePattern = new EventEmitter<{ patternName: string; item: IJobItem }>();

  onUpdate(patternName, item) {
    this.updatePattern.emit({ patternName, item });
  }

  onCreate(patternName) {
    this.createPattern.emit(patternName);
  }
}
