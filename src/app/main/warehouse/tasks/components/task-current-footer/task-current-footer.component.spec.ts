import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCurrentFooterComponent } from './task-current-footer.component';

describe('TaskCurrentFooterComponent', () => {
  let component: TaskCurrentFooterComponent;
  let fixture: ComponentFixture<TaskCurrentFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskCurrentFooterComponent]
    });
    fixture = TestBed.createComponent(TaskCurrentFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
