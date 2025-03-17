import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWallboardDialogComponent } from './edit-wallboard-dialog.component';

describe('EditWallboardDialogComponent', () => {
  let component: EditWallboardDialogComponent;
  let fixture: ComponentFixture<EditWallboardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditWallboardDialogComponent],
    });
    fixture = TestBed.createComponent(EditWallboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
