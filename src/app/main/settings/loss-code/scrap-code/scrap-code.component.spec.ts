import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapCodeComponent } from './scrap-code.component';

describe('ScrapCodeComponent', () => {
  let component: ScrapCodeComponent;
  let fixture: ComponentFixture<ScrapCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrapCodeComponent],
    });
    fixture = TestBed.createComponent(ScrapCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
