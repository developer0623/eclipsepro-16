import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  Renderer2,
  forwardRef,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const SELECT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditSelectComponent),
  multi: true,
};

@Component({
  selector: 'app-edit-select',
  templateUrl: './edit-select.component.html',
  styleUrls: ['./edit-select.component.scss'],
  providers: [SELECT_CONTROL_VALUE_ACCESSOR],
})
export class EditSelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  @ViewChild('mySelect') mySelectElementRef!: ElementRef;
  @Input() data: string;
  @Input() items: any[] = [];
  @Input() valKey: 'string';
  @Input() nameKey: 'string';
  @Input() isOpen = false;
  @Input() isForce = false;
  @Output() onEditing: EventEmitter<string> = new EventEmitter();
  @Output() onaftersave: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;
  private _originalValue: string | number;
  private _value: string = '';
  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;
  constructor() {}

  ngOnInit() {}

  // Control Value Accessors for ngModel
  get value(): any {
    return this._value;
  }

  set value(v) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  // Required for ControlValueAccessor interface
  writeValue(value: any) {
    this._value = value;
  }

  // Required forControlValueAccessor interface
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // Required forControlValueAccessor interface
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  onEditMode(value) {
    this.editMode = true;
    this._originalValue = value;
    this.onEditing.emit('editing click');
    setTimeout(() => {
      if (!this.isForce) {
        this.mySelectElementRef.nativeElement.focus();
      }
    });
  }

  onFocusOut() {
    this.editMode = false;
  }

  onModelChange() {
    this.editMode = false;
    this.onaftersave.emit(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isOpen && !changes.isOpen.currentValue && changes.isOpen.previousValue) {
      this.editMode = false;
    }
  }
}
