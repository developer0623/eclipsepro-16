import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayCodeComponent } from './delay-code.component';

describe('DelayCodeComponent', () => {
  let component: DelayCodeComponent;
  let fixture: ComponentFixture<DelayCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelayCodeComponent],
    });
    fixture = TestBed.createComponent(DelayCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
