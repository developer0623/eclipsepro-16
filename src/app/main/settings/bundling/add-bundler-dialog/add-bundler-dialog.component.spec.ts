import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBundlerDialogComponent } from './add-bundler-dialog.component';

describe('AddBundlerDialogComponent', () => {
  let component: AddBundlerDialogComponent;
  let fixture: ComponentFixture<AddBundlerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBundlerDialogComponent],
    });
    fixture = TestBed.createComponent(AddBundlerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
