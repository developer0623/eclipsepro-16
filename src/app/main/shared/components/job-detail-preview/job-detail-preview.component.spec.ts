import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailPreviewComponent } from './job-detail-preview.component';

describe('JobDetailPreviewComponent', () => {
  let component: JobDetailPreviewComponent;
  let fixture: ComponentFixture<JobDetailPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobDetailPreviewComponent],
    });
    fixture = TestBed.createComponent(JobDetailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
