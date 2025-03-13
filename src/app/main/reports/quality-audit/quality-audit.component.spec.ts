import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityAuditComponent } from './quality-audit.component';

describe('QualityAuditComponent', () => {
  let component: QualityAuditComponent;
  let fixture: ComponentFixture<QualityAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QualityAuditComponent]
    });
    fixture = TestBed.createComponent(QualityAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
