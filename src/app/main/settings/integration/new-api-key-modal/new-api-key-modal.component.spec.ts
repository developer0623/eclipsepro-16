import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApiKeyModalComponent } from './new-api-key-modal.component';

describe('NewApiKeyModalComponent', () => {
  let component: NewApiKeyModalComponent;
  let fixture: ComponentFixture<NewApiKeyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewApiKeyModalComponent],
    });
    fixture = TestBed.createComponent(NewApiKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
