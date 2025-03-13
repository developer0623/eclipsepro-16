import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDateColComponent } from './report-date-col.component';

describe('ReportDateColComponent', () => {
  let component: ReportDateColComponent;
  let fixture: ComponentFixture<ReportDateColComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportDateColComponent],
    });
    fixture = TestBed.createComponent(ReportDateColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
