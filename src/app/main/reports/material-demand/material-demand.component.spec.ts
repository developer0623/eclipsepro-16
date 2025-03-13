import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDemandComponent } from './material-demand.component';

describe('MaterialDemandComponent', () => {
  let component: MaterialDemandComponent;
  let fixture: ComponentFixture<MaterialDemandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialDemandComponent]
    });
    fixture = TestBed.createComponent(MaterialDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
