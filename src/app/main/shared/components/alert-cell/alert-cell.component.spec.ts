import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCellComponent } from './alert-cell.component';

describe('AlertCellComponent', () => {
  let component: AlertCellComponent;
  let fixture: ComponentFixture<AlertCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertCellComponent],
    });
    fixture = TestBed.createComponent(AlertCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
