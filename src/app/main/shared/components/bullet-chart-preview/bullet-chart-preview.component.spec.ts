import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletChartPreviewComponent } from './bullet-chart-preview.component';

describe('BulletChartPreviewComponent', () => {
  let component: BulletChartPreviewComponent;
  let fixture: ComponentFixture<BulletChartPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulletChartPreviewComponent],
    });
    fixture = TestBed.createComponent(BulletChartPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
