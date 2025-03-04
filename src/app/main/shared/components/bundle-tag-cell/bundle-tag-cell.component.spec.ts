import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleTagCellComponent } from './bundle-tag-cell.component';

describe('BundleTagCellComponent', () => {
  let component: BundleTagCellComponent;
  let fixture: ComponentFixture<BundleTagCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BundleTagCellComponent],
    });
    fixture = TestBed.createComponent(BundleTagCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
