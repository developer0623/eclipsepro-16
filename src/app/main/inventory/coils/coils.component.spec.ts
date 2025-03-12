import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilsComponent } from './coils.component';

describe('CoilsComponent', () => {
  let component: CoilsComponent;
  let fixture: ComponentFixture<CoilsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilsComponent]
    });
    fixture = TestBed.createComponent(CoilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
