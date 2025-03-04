import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerTabsComponent } from './scheduler-tabs.component';

describe('SchedulerTabsComponent', () => {
  let component: SchedulerTabsComponent;
  let fixture: ComponentFixture<SchedulerTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulerTabsComponent],
    });
    fixture = TestBed.createComponent(SchedulerTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
