import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAutocompleteComponent } from './edit-autocomplete.component';

describe('EditAutocompleteComponent', () => {
  let component: EditAutocompleteComponent;
  let fixture: ComponentFixture<EditAutocompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAutocompleteComponent],
    });
    fixture = TestBed.createComponent(EditAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
