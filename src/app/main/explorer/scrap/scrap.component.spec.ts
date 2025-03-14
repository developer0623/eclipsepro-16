import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapComponent } from './scrap.component';

describe('ScrapComponent', () => {
  let component: ScrapComponent;
  let fixture: ComponentFixture<ScrapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrapComponent]
    });
    fixture = TestBed.createComponent(ScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
