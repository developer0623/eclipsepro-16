import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcParetoChartComponent } from './dc-pareto-chart.component';

describe('DcParetoChartComponent', () => {
  let component: DcParetoChartComponent;
  let fixture: ComponentFixture<DcParetoChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DcParetoChartComponent]
    });
    fixture = TestBed.createComponent(DcParetoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
