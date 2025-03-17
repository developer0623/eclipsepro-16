import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
})
export class TimeInputComponent {
  @Input() value = '';
  @Input() isHour = false;
  @Output() onChange = new EventEmitter();
  regEx = /[0-5][0-9]/;

  constructor() {
    this.regEx = this.isHour === true ? /(2[0-3]|[01][0-9])/ : /[0-5][0-9]/;
  }

  onValid(val) {
    return this.regEx.test(val);
  }

  onUpdate(val) {
    this.onChange.emit(val);
  }

  onValChange() {
    let convertedValue = '00';
    if (this.value.length === 0) {
      this.onUpdate(convertedValue);
      return;
    }

    if (this.value.length === 1) {
      convertedValue = `0${this.value}`;
    } else if (this.value.length === 3 && this.value[0] === '0') {
      convertedValue = this.value.substring(1);
    } else {
      this.onUpdate(this.value);
      return;
    }

    const isValid = this.onValid(convertedValue);
    if (isValid) {
      this.onUpdate(convertedValue);
    } else {
      this.onUpdate(this.value);
    }
  }
}
