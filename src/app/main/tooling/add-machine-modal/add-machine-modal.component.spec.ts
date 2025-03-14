import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMachineModalComponent } from './add-machine-modal.component';

describe('AddMachineModalComponent', () => {
  let component: AddMachineModalComponent;
  let fixture: ComponentFixture<AddMachineModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMachineModalComponent]
    });
    fixture = TestBed.createComponent(AddMachineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
