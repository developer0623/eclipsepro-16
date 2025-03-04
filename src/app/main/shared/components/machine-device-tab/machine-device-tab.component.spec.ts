import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDeviceTabComponent } from './machine-device-tab.component';

describe('MachineDeviceTabComponent', () => {
  let component: MachineDeviceTabComponent;
  let fixture: ComponentFixture<MachineDeviceTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineDeviceTabComponent]
    });
    fixture = TestBed.createComponent(MachineDeviceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
