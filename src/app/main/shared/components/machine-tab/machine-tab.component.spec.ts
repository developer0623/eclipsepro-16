import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineTabComponent } from './machine-tab.component';

describe('MachineTabComponent', () => {
  let component: MachineTabComponent;
  let fixture: ComponentFixture<MachineTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineTabComponent],
    });
    fixture = TestBed.createComponent(MachineTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
