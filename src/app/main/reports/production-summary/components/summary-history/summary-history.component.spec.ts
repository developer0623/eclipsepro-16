import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryHistoryComponent } from './summary-history.component';

describe('SummaryHistoryComponent', () => {
  let component: SummaryHistoryComponent;
  let fixture: ComponentFixture<SummaryHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryHistoryComponent]
    });
    fixture = TestBed.createComponent(SummaryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
