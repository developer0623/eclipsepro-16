import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IfpmPlan } from 'src/app/core/dto';

@Component({
  selector: 'app-performance-item',
  templateUrl: './performance-item.component.html',
  styleUrls: ['./performance-item.component.scss'],
})
export class PerformanceItemComponent {
  @Input() islength;
  @Input() item: IfpmPlan;
  @Output() onChanged = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  isFocus = false;

  focus() {
    this.setFocus(true);
  }
  blur() {
    this.setFocus(false);
    setTimeout(() => {
      this.onChanged.emit();
    }, 150);
  }

  setFocus = (state) => {
    setTimeout(() => {
      this.isFocus = state;
    }, 200);
  };

  onRemoveItem() {
    this.onRemove.emit();
  }
}
