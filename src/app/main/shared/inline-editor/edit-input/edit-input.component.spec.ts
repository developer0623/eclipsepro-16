import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInputComponent } from './edit-input.component';

describe('EditInputComponent', () => {
  let component: EditInputComponent;
  let fixture: ComponentFixture<EditInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditInputComponent],
    });
    fixture = TestBed.createComponent(EditInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
