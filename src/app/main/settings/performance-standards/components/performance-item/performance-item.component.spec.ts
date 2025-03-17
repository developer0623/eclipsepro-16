import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceItemComponent } from './performance-item.component';

describe('PerformanceItemComponent', () => {
  let component: PerformanceItemComponent;
  let fixture: ComponentFixture<PerformanceItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceItemComponent]
    });
    fixture = TestBed.createComponent(PerformanceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
