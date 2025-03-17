import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingPreviewComponent } from './printing-preview.component';

describe('PrintingPreviewComponent', () => {
  let component: PrintingPreviewComponent;
  let fixture: ComponentFixture<PrintingPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintingPreviewComponent]
    });
    fixture = TestBed.createComponent(PrintingPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
