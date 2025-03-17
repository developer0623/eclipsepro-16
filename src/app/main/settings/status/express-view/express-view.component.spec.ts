import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressViewComponent } from './express-view.component';

describe('ExpressViewComponent', () => {
  let component: ExpressViewComponent;
  let fixture: ComponentFixture<ExpressViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpressViewComponent]
    });
    fixture = TestBed.createComponent(ExpressViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
