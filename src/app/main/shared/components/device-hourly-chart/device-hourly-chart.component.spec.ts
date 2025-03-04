import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceHourlyChartComponent } from './device-hourly-chart.component';

describe('DeviceHourlyChartComponent', () => {
  let component: DeviceHourlyChartComponent;
  let fixture: ComponentFixture<DeviceHourlyChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceHourlyChartComponent],
    });
    fixture = TestBed.createComponent(DeviceHourlyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
