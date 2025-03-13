import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryStateComponent } from './summary-state.component';

describe('SummaryStateComponent', () => {
  let component: SummaryStateComponent;
  let fixture: ComponentFixture<SummaryStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryStateComponent]
    });
    fixture = TestBed.createComponent(SummaryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
