import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTooltipComponent } from './header-tooltip.component';

describe('HeaderTooltipComponent', () => {
  let component: HeaderTooltipComponent;
  let fixture: ComponentFixture<HeaderTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderTooltipComponent]
    });
    fixture = TestBed.createComponent(HeaderTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
