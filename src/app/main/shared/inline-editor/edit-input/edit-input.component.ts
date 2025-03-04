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
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EditInputComponent),
  multi: true,
};

@Component({
  selector: 'app-edit-input',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR],
})
export class EditInputComponent implements ControlValueAccessor, OnInit, OnChanges {
  @ViewChild('inputEditorControl') inputEditorControl: ElementRef;
  @Input() data: number | string;
  @Input() showEditButtons: boolean = false;
  @Input() type: string = 'text';
  @Input() isOpen = false;
  @Input() isForce = false;
  @Output() onaftersave: EventEmitter<number | string> = new EventEmitter<number | string>();
  @Output() onOpenClose: EventEmitter<boolean> = new EventEmitter<boolean>();
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
    this.onOpenClose.emit(true);
  }

  onSaveClose() {
    this.editMode = false;
    if (this.value !== this._originalValue) {
      this.onaftersave.emit(this.value);
    }
    this.onOpenClose.emit(false);
  }

  onFocusOut() {
    this.editMode = false;
    this.value = this._originalValue;
    this.onOpenClose.emit(false);
  }

  onFocusOut1() {
    window.setTimeout(() => {
      if (this.editMode) {
        this.onFocusOut();
      }
    }, 150);
  }

  onCancel($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.editMode = false;
    this.value = this._originalValue;
    this.onOpenClose.emit(false);
  }

  // this doesn't seem to be working.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isOpen && !changes.isOpen.currentValue && changes.isOpen.previousValue) {
      this.editMode = false;
    }
  }
}
