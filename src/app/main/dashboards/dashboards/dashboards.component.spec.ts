import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboards2Component } from './dashboards.component';

describe('Dashboards2Component', () => {
  let component: Dashboards2Component;
  let fixture: ComponentFixture<Dashboards2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Dashboards2Component],
    });
    fixture = TestBed.createComponent(Dashboards2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
