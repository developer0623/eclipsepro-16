import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xl200DetailComponent } from './xl200-detail.component';

describe('Xl200DetailComponent', () => {
  let component: Xl200DetailComponent;
  let fixture: ComponentFixture<Xl200DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xl200DetailComponent],
    });
    fixture = TestBed.createComponent(Xl200DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
