import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSummaryDialogComponent } from './machine-summary-dialog.component';

describe('MachineSummaryDialogComponent', () => {
  let component: MachineSummaryDialogComponent;
  let fixture: ComponentFixture<MachineSummaryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineSummaryDialogComponent]
    });
    fixture = TestBed.createComponent(MachineSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
