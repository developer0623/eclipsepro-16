import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolingUsageComponent } from './tooling-usage.component';

describe('ToolingUsageComponent', () => {
  let component: ToolingUsageComponent;
  let fixture: ComponentFixture<ToolingUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolingUsageComponent]
    });
    fixture = TestBed.createComponent(ToolingUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
