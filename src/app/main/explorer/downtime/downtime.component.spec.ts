import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeComponent } from './downtime.component';

describe('DowntimeComponent', () => {
  let component: DowntimeComponent;
  let fixture: ComponentFixture<DowntimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DowntimeComponent]
    });
    fixture = TestBed.createComponent(DowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
