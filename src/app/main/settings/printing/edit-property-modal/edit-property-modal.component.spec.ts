import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropertyModalComponent } from './edit-property-modal.component';

describe('EditPropertyModalComponent', () => {
  let component: EditPropertyModalComponent;
  let fixture: ComponentFixture<EditPropertyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPropertyModalComponent]
    });
    fixture = TestBed.createComponent(EditPropertyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
