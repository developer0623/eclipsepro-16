import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSummaryTimebarComponent } from './print-summary-timebar.component';

describe('PrintSummaryTimebarComponent', () => {
  let component: PrintSummaryTimebarComponent;
  let fixture: ComponentFixture<PrintSummaryTimebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintSummaryTimebarComponent]
    });
    fixture = TestBed.createComponent(PrintSummaryTimebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
