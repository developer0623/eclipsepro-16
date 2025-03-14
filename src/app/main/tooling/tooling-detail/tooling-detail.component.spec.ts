import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolingDetailComponent } from './tooling-detail.component';

describe('ToolingDetailComponent', () => {
  let component: ToolingDetailComponent;
  let fixture: ComponentFixture<ToolingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolingDetailComponent]
    });
    fixture = TestBed.createComponent(ToolingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
