import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDefChangeDialogComponent } from './order-def-change-dialog.component';

describe('OrderDefChangeDialogComponent', () => {
  let component: OrderDefChangeDialogComponent;
  let fixture: ComponentFixture<OrderDefChangeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDefChangeDialogComponent],
    });
    fixture = TestBed.createComponent(OrderDefChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
