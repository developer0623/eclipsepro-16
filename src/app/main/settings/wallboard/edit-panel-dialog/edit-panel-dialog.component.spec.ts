import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPanelDialogComponent } from './edit-panel-dialog.component';

describe('EditPanelDialogComponent', () => {
  let component: EditPanelDialogComponent;
  let fixture: ComponentFixture<EditPanelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPanelDialogComponent],
    });
    fixture = TestBed.createComponent(EditPanelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
