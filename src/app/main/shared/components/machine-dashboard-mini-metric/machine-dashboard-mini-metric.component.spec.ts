import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDashboardMiniMetricComponent } from './machine-dashboard-mini-metric.component';

describe('MachineDashboardMiniMetricComponent', () => {
  let component: MachineDashboardMiniMetricComponent;
  let fixture: ComponentFixture<MachineDashboardMiniMetricComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineDashboardMiniMetricComponent]
    });
    fixture = TestBed.createComponent(MachineDashboardMiniMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
