import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapSummaryComponent } from './scrap-summary.component';

describe('ScrapSummaryComponent', () => {
  let component: ScrapSummaryComponent;
  let fixture: ComponentFixture<ScrapSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrapSummaryComponent],
    });
    fixture = TestBed.createComponent(ScrapSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
