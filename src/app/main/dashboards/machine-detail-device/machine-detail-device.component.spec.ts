import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDetailComponentDevice } from './machine-detail-device.component';

describe('MachineDetailComponentDevice', () => {
  let component: MachineDetailComponentDevice;
  let fixture: ComponentFixture<MachineDetailComponentDevice>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineDetailComponentDevice],
    });
    fixture = TestBed.createComponent(MachineDetailComponentDevice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
