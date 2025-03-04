import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftHistoryChartComponent } from './shift-history-chart.component';

describe('ShiftHistoryChartComponent', () => {
  let component: ShiftHistoryChartComponent;
  let fixture: ComponentFixture<ShiftHistoryChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShiftHistoryChartComponent],
    });
    fixture = TestBed.createComponent(ShiftHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
