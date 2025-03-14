import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xl200LockoutItemComponent } from './xl200-lockout-item.component';

describe('Xl200LockoutItemComponent', () => {
  let component: Xl200LockoutItemComponent;
  let fixture: ComponentFixture<Xl200LockoutItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xl200LockoutItemComponent],
    });
    fixture = TestBed.createComponent(Xl200LockoutItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
