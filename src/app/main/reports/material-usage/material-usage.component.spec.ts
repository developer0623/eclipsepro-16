import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialUsageComponent } from './material-usage.component';

describe('MaterialUsageComponent', () => {
  let component: MaterialUsageComponent;
  let fixture: ComponentFixture<MaterialUsageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialUsageComponent]
    });
    fixture = TestBed.createComponent(MaterialUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
