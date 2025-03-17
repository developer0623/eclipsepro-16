import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossCodeComponent } from './loss-code.component';

describe('LossCodeComponent', () => {
  let component: LossCodeComponent;
  let fixture: ComponentFixture<LossCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LossCodeComponent],
    });
    fixture = TestBed.createComponent(LossCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
