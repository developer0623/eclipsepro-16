import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDetailComponentXl } from './machine-detail-xl.component';

describe('MachineDetailComponentXl', () => {
  let component: MachineDetailComponentXl;
  let fixture: ComponentFixture<MachineDetailComponentXl>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineDetailComponentXl],
    });
    fixture = TestBed.createComponent(MachineDetailComponentXl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
