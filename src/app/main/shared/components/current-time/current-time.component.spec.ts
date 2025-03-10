import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTimeComponent } from './current-time.component';

describe('CurrentTimeComponent', () => {
  let component: CurrentTimeComponent;
  let fixture: ComponentFixture<CurrentTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentTimeComponent],
    });
    fixture = TestBed.createComponent(CurrentTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
