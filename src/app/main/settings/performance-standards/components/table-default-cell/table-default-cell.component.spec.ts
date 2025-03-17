import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDefaultCellComponent } from './table-default-cell.component';

describe('TableDefaultCellComponent', () => {
  let component: TableDefaultCellComponent;
  let fixture: ComponentFixture<TableDefaultCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableDefaultCellComponent]
    });
    fixture = TestBed.createComponent(TableDefaultCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
