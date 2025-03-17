import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkgroupComponent } from './edit-workgroup.component';

describe('EditWorkgroupComponent', () => {
  let component: EditWorkgroupComponent;
  let fixture: ComponentFixture<EditWorkgroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditWorkgroupComponent],
    });
    fixture = TestBed.createComponent(EditWorkgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
