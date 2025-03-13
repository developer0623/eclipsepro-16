import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTimebarComponent } from './summary-timebar.component';

describe('SummaryTimebarComponent', () => {
  let component: SummaryTimebarComponent;
  let fixture: ComponentFixture<SummaryTimebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryTimebarComponent]
    });
    fixture = TestBed.createComponent(SummaryTimebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
