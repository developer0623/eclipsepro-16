import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineTabsComponent } from './machine-tabs.component';

describe('MachineTabsComponent', () => {
  let component: MachineTabsComponent;
  let fixture: ComponentFixture<MachineTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineTabsComponent],
    });
    fixture = TestBed.createComponent(MachineTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
