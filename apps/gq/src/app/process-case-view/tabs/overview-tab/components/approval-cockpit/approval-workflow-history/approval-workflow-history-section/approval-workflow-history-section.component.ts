import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-approval-workflow-history-section',
  templateUrl: './approval-workflow-history-section.component.html',
})
export class ApprovalWorkflowHistorySectionComponent {
  @Input() icon: string;
  @Input() iconColor: string;
  @Input() title: string;
  @Input() titleTextColor: string;
  @Input() subtitle: string;
  @Input() comment: string;
  @Input() isIterationItem = false;
  @Input() iterationItemIconColor: string;
}
