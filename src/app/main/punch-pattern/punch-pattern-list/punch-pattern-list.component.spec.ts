import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchPatternListComponent } from './punch-pattern-list.component';

describe('PunchPatternListComponent', () => {
  let component: PunchPatternListComponent;
  let fixture: ComponentFixture<PunchPatternListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PunchPatternListComponent]
    });
    fixture = TestBed.createComponent(PunchPatternListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
