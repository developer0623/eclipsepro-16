import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchPatternPreviewComponent } from './punch-pattern-preview.component';

describe('PunchPatternPreviewComponent', () => {
  let component: PunchPatternPreviewComponent;
  let fixture: ComponentFixture<PunchPatternPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PunchPatternPreviewComponent],
    });
    fixture = TestBed.createComponent(PunchPatternPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
