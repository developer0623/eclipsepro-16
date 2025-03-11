import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchRowComponent } from './punch-row.component';

describe('PunchRowComponent', () => {
  let component: PunchRowComponent;
  let fixture: ComponentFixture<PunchRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PunchRowComponent]
    });
    fixture = TestBed.createComponent(PunchRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
