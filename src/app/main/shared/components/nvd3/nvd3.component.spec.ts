import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nvd3Component } from './nvd3.component';

describe('Nvd3Component', () => {
  let component: Nvd3Component;
  let fixture: ComponentFixture<Nvd3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Nvd3Component],
    });
    fixture = TestBed.createComponent(Nvd3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
