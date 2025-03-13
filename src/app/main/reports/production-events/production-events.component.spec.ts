import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionEventsComponent } from './production-events.component';

describe('ProductionEventsComponent', () => {
  let component: ProductionEventsComponent;
  let fixture: ComponentFixture<ProductionEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionEventsComponent]
    });
    fixture = TestBed.createComponent(ProductionEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
