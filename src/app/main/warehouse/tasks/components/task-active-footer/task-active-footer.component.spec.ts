import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskActiveFooterComponent } from './task-active-footer.component';

describe('TaskActiveFooterComponent', () => {
  let component: TaskActiveFooterComponent;
  let fixture: ComponentFixture<TaskActiveFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskActiveFooterComponent]
    });
    fixture = TestBed.createComponent(TaskActiveFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
