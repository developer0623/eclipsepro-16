import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingActionsToAgentComponent } from './pending-actions-to-agent.component';

describe('PendingActionsToAgentComponent', () => {
  let component: PendingActionsToAgentComponent;
  let fixture: ComponentFixture<PendingActionsToAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingActionsToAgentComponent]
    });
    fixture = TestBed.createComponent(PendingActionsToAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
