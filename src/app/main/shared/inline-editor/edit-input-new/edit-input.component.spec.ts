import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInputNewComponent } from './edit-input.component';

describe('EditInputComponent', () => {
  let component: EditInputNewComponent;
  let fixture: ComponentFixture<EditInputNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditInputNewComponent],
    });
    fixture = TestBed.createComponent(EditInputNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
