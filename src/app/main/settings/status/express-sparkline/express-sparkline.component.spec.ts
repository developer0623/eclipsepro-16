import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressSparklineComponent } from './express-sparkline.component';

describe('ExpressSparklineComponent', () => {
  let component: ExpressSparklineComponent;
  let fixture: ComponentFixture<ExpressSparklineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpressSparklineComponent]
    });
    fixture = TestBed.createComponent(ExpressSparklineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
