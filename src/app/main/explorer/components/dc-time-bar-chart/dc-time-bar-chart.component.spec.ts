import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcTimeBarChartComponent } from './dc-time-bar-chart.component';

describe('DcTimeBarChartComponent', () => {
  let component: DcTimeBarChartComponent;
  let fixture: ComponentFixture<DcTimeBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DcTimeBarChartComponent]
    });
    fixture = TestBed.createComponent(DcTimeBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
