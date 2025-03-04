import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndonDisplayComponent } from './andon-display.component';

describe('AndonDisplayComponent', () => {
  let component: AndonDisplayComponent;
  let fixture: ComponentFixture<AndonDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AndonDisplayComponent],
    });
    fixture = TestBed.createComponent(AndonDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
