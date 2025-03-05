import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertScheduleSlipComponent } from './alert-schedule-slip.component';

describe('AlertScheduleSlipComponent', () => {
  let component: AlertScheduleSlipComponent;
  let fixture: ComponentFixture<AlertScheduleSlipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertScheduleSlipComponent]
    });
    fixture = TestBed.createComponent(AlertScheduleSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
