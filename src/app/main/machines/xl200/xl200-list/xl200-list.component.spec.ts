import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xl200ListComponent } from './xl200-list.component';

describe('Xl200ListComponent', () => {
  let component: Xl200ListComponent;
  let fixture: ComponentFixture<Xl200ListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xl200ListComponent],
    });
    fixture = TestBed.createComponent(Xl200ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
