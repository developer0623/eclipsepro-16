import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDashboardMiniComponent } from './device-dashboard-mini.component';

describe('DeviceDashboardMiniComponent', () => {
  let component: DeviceDashboardMiniComponent;
  let fixture: ComponentFixture<DeviceDashboardMiniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceDashboardMiniComponent],
    });
    fixture = TestBed.createComponent(DeviceDashboardMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
