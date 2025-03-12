import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilTypesComponent } from './coil-types.component';

describe('CoilTypesComponent', () => {
  let component: CoilTypesComponent;
  let fixture: ComponentFixture<CoilTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilTypesComponent]
    });
    fixture = TestBed.createComponent(CoilTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
