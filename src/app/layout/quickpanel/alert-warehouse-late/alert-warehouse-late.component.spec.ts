import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertWarehouseLateComponent } from './alert-warehouse-late.component';

describe('AlertWarehouseLateComponent', () => {
  let component: AlertWarehouseLateComponent;
  let fixture: ComponentFixture<AlertWarehouseLateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertWarehouseLateComponent]
    });
    fixture = TestBed.createComponent(AlertWarehouseLateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
