import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatternModalComponent } from './add-pattern-modal.component';

describe('AddPatternModalComponent', () => {
  let component: AddPatternModalComponent;
  let fixture: ComponentFixture<AddPatternModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPatternModalComponent]
    });
    fixture = TestBed.createComponent(AddPatternModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
