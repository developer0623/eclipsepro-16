import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleItemComponent } from './bundle-item.component';

describe('BundleItemComponent', () => {
  let component: BundleItemComponent;
  let fixture: ComponentFixture<BundleItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BundleItemComponent],
    });
    fixture = TestBed.createComponent(BundleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
