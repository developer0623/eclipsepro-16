import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSequenceComponent } from './order-sequence.component';

describe('OrderSequenceComponent', () => {
  let component: OrderSequenceComponent;
  let fixture: ComponentFixture<OrderSequenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSequenceComponent]
    });
    fixture = TestBed.createComponent(OrderSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
