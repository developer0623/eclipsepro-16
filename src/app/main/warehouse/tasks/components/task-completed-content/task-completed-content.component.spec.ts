import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCompletedContentComponent } from './task-completed-content.component';

describe('TaskCompletedContentComponent', () => {
  let component: TaskCompletedContentComponent;
  let fixture: ComponentFixture<TaskCompletedContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskCompletedContentComponent]
    });
    fixture = TestBed.createComponent(TaskCompletedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
