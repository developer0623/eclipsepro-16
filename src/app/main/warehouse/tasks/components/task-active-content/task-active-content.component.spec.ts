import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskActiveContentComponent } from './task-active-content.component';

describe('TaskActiveContentComponent', () => {
  let component: TaskActiveContentComponent;
  let fixture: ComponentFixture<TaskActiveContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskActiveContentComponent]
    });
    fixture = TestBed.createComponent(TaskActiveContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
