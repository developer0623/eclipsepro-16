import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkgroupComponent } from './workgroups.component.ts';

describe('WorkgroupsComponent', () => {
  let component: WorkgroupsComponent;
  let fixture: ComponentFixture<WorkgroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkgroupsComponent]
    });
    fixture = TestBed.createComponent(WorkgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
