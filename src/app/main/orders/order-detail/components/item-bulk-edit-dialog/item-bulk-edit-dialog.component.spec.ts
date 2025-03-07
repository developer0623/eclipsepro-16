import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBulkEditDialogComponent } from './item-bulk-edit-dialog.component';

describe('ItemBulkEditDialogComponent', () => {
  let component: ItemBulkEditDialogComponent;
  let fixture: ComponentFixture<ItemBulkEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemBulkEditDialogComponent],
    });
    fixture = TestBed.createComponent(ItemBulkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
