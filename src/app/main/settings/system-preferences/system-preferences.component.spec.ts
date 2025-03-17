import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPreferencesComponent } from './system-preferences.component';

describe('SystemPreferencesComponent', () => {
  let component: SystemPreferencesComponent;
  let fixture: ComponentFixture<SystemPreferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SystemPreferencesComponent],
    });
    fixture = TestBed.createComponent(SystemPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
