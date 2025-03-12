import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilTypeDetailComponent } from './coil-type-detail.component';

describe('CoilTypeDetailComponent', () => {
  let component: CoilTypeDetailComponent;
  let fixture: ComponentFixture<CoilTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilTypeDetailComponent]
    });
    fixture = TestBed.createComponent(CoilTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
