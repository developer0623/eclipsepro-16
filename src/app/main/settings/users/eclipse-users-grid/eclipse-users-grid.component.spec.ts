import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EclipseUsersGridComponent } from './eclipse-users-grid.component';

describe('EclipseUsersGridComponent', () => {
  let component: EclipseUsersGridComponent;
  let fixture: ComponentFixture<EclipseUsersGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EclipseUsersGridComponent]
    });
    fixture = TestBed.createComponent(EclipseUsersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
