import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilScrapComponent } from './coil-scrap.component';

describe('CoilScrapComponent', () => {
  let component: CoilScrapComponent;
  let fixture: ComponentFixture<CoilScrapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoilScrapComponent]
    });
    fixture = TestBed.createComponent(CoilScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
