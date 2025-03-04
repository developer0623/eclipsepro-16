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
  HostListener,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DATE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditDateComponent),
  multi: true,
};

@Component({
  selector: 'app-edit-date',
  templateUrl: './edit-date.component.html',
  styleUrls: ['./edit-date.component.scss'],
  providers: [DATE_EDIT_CONTROL_VALUE_ACCESSOR],
})
export class EditDateComponent implements ControlValueAccessor, OnInit {
  @ViewChild('dateEditorControl') dateEditorControl: ElementRef;
  @Input() showEditButtons: boolean = false;
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Output() onCancel: EventEmitter<string> = new EventEmitter();
  @Output() onOpenClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  editing = false;
  public preValue: string = '';
  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;
  private _originalValue: string;
  private _value: string = '';

  constructor() {}

  ngOnInit() {}

  // Control Value Accessors for ngModel
  get value(): any {
    return this._value;
  }

  set value(v: any) {
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

  // Do stuff when the input element loses focus
  onBlur($event: Event) {
    this.editing = false;
    this.onOpenClose.emit(false);
  }

  onEditMode(value) {
    this.editing = true;
    this._originalValue = value;
    this.onOpenClose.emit(true);
  }

  onSaveClose() {
    this.editing = false;
    this.onSave.emit(this.value);
    this.onOpenClose.emit(false);
  }

  onFocusOut() {
    this.value = this._originalValue;
    this.editing = false;
    this.onOpenClose.emit(false);
  }
}
