import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEditDialogComponent } from './material-edit-dialog.component';

describe('MaterialEditDialogComponent', () => {
  let component: MaterialEditDialogComponent;
  let fixture: ComponentFixture<MaterialEditDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialEditDialogComponent]
    });
    fixture = TestBed.createComponent(MaterialEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
