import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyManagementFormComponent } from './api-key-management-form.component';

describe('ApiKeyManagementFormComponent', () => {
  let component: ApiKeyManagementFormComponent;
  let fixture: ComponentFixture<ApiKeyManagementFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApiKeyManagementFormComponent],
    });
    fixture = TestBed.createComponent(ApiKeyManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
