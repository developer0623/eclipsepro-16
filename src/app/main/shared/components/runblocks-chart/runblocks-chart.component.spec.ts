import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunblocksChartComponent } from './runblocks-chart.component';

describe('RunblocksChartComponent', () => {
  let component: RunblocksChartComponent;
  let fixture: ComponentFixture<RunblocksChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RunblocksChartComponent],
    });
    fixture = TestBed.createComponent(RunblocksChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
