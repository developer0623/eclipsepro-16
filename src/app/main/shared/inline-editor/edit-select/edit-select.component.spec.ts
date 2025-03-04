import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelectComponent } from './edit-select.component';

describe('EditSelectComponent', () => {
  let component: EditSelectComponent;
  let fixture: ComponentFixture<EditSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSelectComponent],
    });
    fixture = TestBed.createComponent(EditSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
