import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEditDialogComponent } from './bulk-edit-dialog.component';

describe('BulkEditDialogComponent', () => {
  let component: BulkEditDialogComponent;
  let fixture: ComponentFixture<BulkEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkEditDialogComponent],
    });
    fixture = TestBed.createComponent(BulkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
