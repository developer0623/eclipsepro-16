import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToolingModalComponent } from './add-tooling-modal.component';

describe('AddToolingModalComponent', () => {
  let component: AddToolingModalComponent;
  let fixture: ComponentFixture<AddToolingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddToolingModalComponent]
    });
    fixture = TestBed.createComponent(AddToolingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
