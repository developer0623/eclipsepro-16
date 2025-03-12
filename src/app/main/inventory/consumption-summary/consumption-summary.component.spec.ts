import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionSummaryComponent } from './consumption-summary.component';

describe('ConsumptionSummaryComponent', () => {
  let component: ConsumptionSummaryComponent;
  let fixture: ComponentFixture<ConsumptionSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumptionSummaryComponent]
    });
    fixture = TestBed.createComponent(ConsumptionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
