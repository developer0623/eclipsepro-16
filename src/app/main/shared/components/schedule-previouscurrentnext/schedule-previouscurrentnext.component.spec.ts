import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePreviouscurrentnextComponent } from './schedule-previouscurrentnext.component';

describe('SchedulePreviouscurrentnextComponent', () => {
  let component: SchedulePreviouscurrentnextComponent;
  let fixture: ComponentFixture<SchedulePreviouscurrentnextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePreviouscurrentnextComponent],
    });
    fixture = TestBed.createComponent(SchedulePreviouscurrentnextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
