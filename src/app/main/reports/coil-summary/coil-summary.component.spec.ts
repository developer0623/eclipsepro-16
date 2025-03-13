import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilSummaryComponent } from './coil-summary.component';

describe('CoilSummaryComponent', () => {
  let component: CoilSummaryComponent;
  let fixture: ComponentFixture<CoilSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilSummaryComponent]
    });
    fixture = TestBed.createComponent(CoilSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
