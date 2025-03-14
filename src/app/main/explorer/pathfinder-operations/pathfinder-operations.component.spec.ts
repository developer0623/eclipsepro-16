import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfinderOperationsComponent } from './pathfinder-operations.component';

describe('PathfinderOperationsComponent', () => {
  let component: PathfinderOperationsComponent;
  let fixture: ComponentFixture<PathfinderOperationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathfinderOperationsComponent]
    });
    fixture = TestBed.createComponent(PathfinderOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
