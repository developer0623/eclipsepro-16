import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcLinearBarChartComponent } from './dc-linear-bar-chart.component';

describe('DcLinearBarChartComponent', () => {
  let component: DcLinearBarChartComponent;
  let fixture: ComponentFixture<DcLinearBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DcLinearBarChartComponent]
    });
    fixture = TestBed.createComponent(DcLinearBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
