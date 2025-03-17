import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensingComponent } from './licensing.component';

describe('LicensingComponent', () => {
  let component: LicensingComponent;
  let fixture: ComponentFixture<LicensingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LicensingComponent],
    });
    fixture = TestBed.createComponent(LicensingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
