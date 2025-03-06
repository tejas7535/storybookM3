import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-approval-workflow-history-section',
  templateUrl: './approval-workflow-history-section.component.html',
  standalone: false,
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
  @Input() showTimeline = false;
  @Input() showInterruptedTimeline = false;
  @Input() borderClass: string[];
  @Input() isButton = false;

  get getBorderClass(): string {
    return this.borderClass ? this.borderClass.join(' ') : '';
  }
}
