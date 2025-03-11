import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchPatternDetailComponent } from './punch-pattern-detail.component';

describe('PunchPatternDetailComponent', () => {
  let component: PunchPatternDetailComponent;
  let fixture: ComponentFixture<PunchPatternDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PunchPatternDetailComponent]
    });
    fixture = TestBed.createComponent(PunchPatternDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
