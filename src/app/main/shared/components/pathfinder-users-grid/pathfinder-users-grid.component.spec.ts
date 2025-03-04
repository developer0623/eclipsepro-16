import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfinderUsersGridComponent } from './pathfinder-users-grid.component';

describe('PathfinderUsersGridComponent', () => {
  let component: PathfinderUsersGridComponent;
  let fixture: ComponentFixture<PathfinderUsersGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathfinderUsersGridComponent]
    });
    fixture = TestBed.createComponent(PathfinderUsersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
