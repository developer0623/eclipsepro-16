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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditInputNewComponent),
  multi: true,
};

@Component({
  selector: 'app-edit-input-new',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR],
})
export class EditInputNewComponent implements ControlValueAccessor, OnInit {
  @ViewChild('inputEditorControl') inputEditorControl: ElementRef;
  @Input() data: number | string;
  @Input() showEditButtons: boolean = false;
  @Input() type: string = 'text';
  @Output() onaftersave: EventEmitter<number | string> = new EventEmitter<number | string>();
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
  }

  onSaveClose() {
    this.editMode = false;
    this.onaftersave.emit(this.value);
  }

  onFocusOut() {
    this.editMode = false;
    this.value = this._originalValue;
  }

  onFocusOut1() {
    window.setTimeout(() => {
      if (this.editMode) {
        this.onFocusOut();
      }
    }, 100);
  }
}
