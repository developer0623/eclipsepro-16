import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConfigComponent } from './add-config.component';

describe('AddConfigComponent', () => {
  let component: AddConfigComponent;
  let fixture: ComponentFixture<AddConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddConfigComponent],
    });
    fixture = TestBed.createComponent(AddConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
