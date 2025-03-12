import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilTagPrintDialogComponent } from './coil-tag-print-dialog.component';

describe('CoilTagPrintDialogComponent', () => {
  let component: CoilTagPrintDialogComponent;
  let fixture: ComponentFixture<CoilTagPrintDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilTagPrintDialogComponent]
    });
    fixture = TestBed.createComponent(CoilTagPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
