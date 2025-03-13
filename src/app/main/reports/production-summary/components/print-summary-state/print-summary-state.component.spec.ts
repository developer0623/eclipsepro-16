import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSummaryStateComponent } from './print-summary-state.component';

describe('PrintSummaryStateComponent', () => {
  let component: PrintSummaryStateComponent;
  let fixture: ComponentFixture<PrintSummaryStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintSummaryStateComponent]
    });
    fixture = TestBed.createComponent(PrintSummaryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
