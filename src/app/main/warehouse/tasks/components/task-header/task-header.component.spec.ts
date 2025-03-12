import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHeaderComponent } from './task-header.component';

describe('TaskHeaderComponent', () => {
  let component: TaskHeaderComponent;
  let fixture: ComponentFixture<TaskHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskHeaderComponent]
    });
    fixture = TestBed.createComponent(TaskHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
