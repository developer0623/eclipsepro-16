import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodProductionComponent } from './good-production.component';

describe('GoodProductionComponent', () => {
  let component: GoodProductionComponent;
  let fixture: ComponentFixture<GoodProductionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoodProductionComponent]
    });
    fixture = TestBed.createComponent(GoodProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
