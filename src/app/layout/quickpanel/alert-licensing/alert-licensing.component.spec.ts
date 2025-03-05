import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertLicensingComponent } from './alert-licensing.component';

describe('AlertLicensingComponent', () => {
  let component: AlertLicensingComponent;
  let fixture: ComponentFixture<AlertLicensingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertLicensingComponent]
    });
    fixture = TestBed.createComponent(AlertLicensingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
