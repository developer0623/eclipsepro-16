import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineToNewBundlesDialogComponent } from './combine-to-new-bundles-dialog.component';

describe('CombineToNewBundlesDialogComponent', () => {
  let component: CombineToNewBundlesDialogComponent;
  let fixture: ComponentFixture<CombineToNewBundlesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CombineToNewBundlesDialogComponent],
    });
    fixture = TestBed.createComponent(CombineToNewBundlesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
