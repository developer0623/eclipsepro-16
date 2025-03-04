import { Component, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-autocomplete',
  templateUrl: './edit-autocomplete.component.html',
  styleUrls: ['./edit-autocomplete.component.scss'],
})
export class EditAutocompleteComponent {
  @Input() items: any[];
  @Input() data: string;
  @Input() valKey: 'string';
  @Input() nameKey: 'string';
  @Output() onaftersave: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('input') autoInput!: ElementRef;
  editMode = false;
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];

  ngOnInit() {}

  onSelectOption(val) {
    this.onaftersave.emit(val);
    this.editMode = false;
  }

  onSaveClose() {
    this.onaftersave.emit(this.data);
    setTimeout(() => {
      this.editMode = false;
    }, 200);
  }

  onEditMode() {
    this.editMode = true;
    setTimeout(() => {
      this.autoInput.nativeElement.focus();
    });
  }

  onFocusOut() {
    setTimeout(() => {
      this.editMode = false;
    });
  }
}
