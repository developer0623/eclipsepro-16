import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelaySummaryComponent } from './delay-summary.component';

describe('DelaySummaryComponent', () => {
  let component: DelaySummaryComponent;
  let fixture: ComponentFixture<DelaySummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelaySummaryComponent],
    });
    fixture = TestBed.createComponent(DelaySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
