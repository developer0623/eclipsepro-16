import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertGeneralComponent } from './alert-general.component';

describe('AlertGeneralComponent', () => {
  let component: AlertGeneralComponent;
  let fixture: ComponentFixture<AlertGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertGeneralComponent]
    });
    fixture = TestBed.createComponent(AlertGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
