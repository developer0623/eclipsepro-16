import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceStandardsComponent } from './performance-standards.component';

describe('PerformanceStandardsComponent', () => {
  let component: PerformanceStandardsComponent;
  let fixture: ComponentFixture<PerformanceStandardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceStandardsComponent]
    });
    fixture = TestBed.createComponent(PerformanceStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
