import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LockdownCodeValue } from 'src/app/core/dto';

@Component({
  selector: 'app-xl200-lockout-item',
  templateUrl: './xl200-lockout-item.component.html',
  styleUrls: ['./xl200-lockout-item.component.scss'],
})
export class Xl200LockoutItemComponent {
  @Input() label = '';
  @Input() lockValue: LockdownCodeValue;
  @Output() onChange = new EventEmitter<string>();
  labelStr: string;
  helpStr: string;

  constructor() {
    this.labelStr = `xl200.${this.label}`;
    this.helpStr = `xl200.${this.label}.help`;
  }

  onGroupChange() {
    this.onChange.emit(this.lockValue);
  }
}
