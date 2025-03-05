import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertIntegrationErrorComponent } from './alert-integration-error.component';

describe('AlertIntegrationErrorComponent', () => {
  let component: AlertIntegrationErrorComponent;
  let fixture: ComponentFixture<AlertIntegrationErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertIntegrationErrorComponent]
    });
    fixture = TestBed.createComponent(AlertIntegrationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
