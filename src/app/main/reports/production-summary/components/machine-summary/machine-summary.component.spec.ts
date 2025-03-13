import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSummaryComponent } from './machine-summary.component';

describe('MachineSummaryComponent', () => {
  let component: MachineSummaryComponent;
  let fixture: ComponentFixture<MachineSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineSummaryComponent]
    });
    fixture = TestBed.createComponent(MachineSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
