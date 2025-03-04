import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilTypePreviewComponent } from './coil-type-preview.component';

describe('CoilTypePreviewComponent', () => {
  let component: CoilTypePreviewComponent;
  let fixture: ComponentFixture<CoilTypePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilTypePreviewComponent],
    });
    fixture = TestBed.createComponent(CoilTypePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
