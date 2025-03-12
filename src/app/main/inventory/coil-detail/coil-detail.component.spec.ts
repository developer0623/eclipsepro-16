import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilDetailComponent } from './coil-detail.component';

describe('CoilDetailComponent', () => {
  let component: CoilDetailComponent;
  let fixture: ComponentFixture<CoilDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilDetailComponent]
    });
    fixture = TestBed.createComponent(CoilDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
