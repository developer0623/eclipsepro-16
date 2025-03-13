import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMachineSummaryComponent } from './print-machine-summary.component';

describe('PrintMachineSummaryComponent', () => {
  let component: PrintMachineSummaryComponent;
  let fixture: ComponentFixture<PrintMachineSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintMachineSummaryComponent]
    });
    fixture = TestBed.createComponent(PrintMachineSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
