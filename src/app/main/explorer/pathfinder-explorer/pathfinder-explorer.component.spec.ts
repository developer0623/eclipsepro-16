import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfinderExplorerComponent } from './pathfinder-explorer.component';

describe('PathfinderExplorerComponent', () => {
  let component: PathfinderExplorerComponent;
  let fixture: ComponentFixture<PathfinderExplorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathfinderExplorerComponent]
    });
    fixture = TestBed.createComponent(PathfinderExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
