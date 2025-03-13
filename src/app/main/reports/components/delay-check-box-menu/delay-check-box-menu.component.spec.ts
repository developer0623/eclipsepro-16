import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayCheckBoxMenuComponent } from './delay-check-box-menu.component';

describe('DelayCheckBoxMenuComponent', () => {
  let component: DelayCheckBoxMenuComponent;
  let fixture: ComponentFixture<DelayCheckBoxMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelayCheckBoxMenuComponent],
    });
    fixture = TestBed.createComponent(DelayCheckBoxMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
