import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xl200PatternsComponent } from './xl200-patterns.component';

describe('Xl200PatternsComponent', () => {
  let component: Xl200PatternsComponent;
  let fixture: ComponentFixture<Xl200PatternsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xl200PatternsComponent],
    });
    fixture = TestBed.createComponent(Xl200PatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
