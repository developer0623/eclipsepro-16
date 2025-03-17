import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricConfigComponent } from './metric-config.component';

describe('MetricConfigComponent', () => {
  let component: MetricConfigComponent;
  let fixture: ComponentFixture<MetricConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetricConfigComponent],
    });
    fixture = TestBed.createComponent(MetricConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
