import { Component, Input } from '@angular/core';
import { IPendingActionsToAgent } from 'src/app/core/dto';

@Component({
  selector: 'pending-actions-to-agent-grid',
  templateUrl: './pending-actions-to-agent.component.html',
  styleUrls: ['./pending-actions-to-agent.component.scss'],
})
export class PendingActionsToAgentComponent {
  @Input() pendingAgentActions: IPendingActionsToAgent[] = [];
}
