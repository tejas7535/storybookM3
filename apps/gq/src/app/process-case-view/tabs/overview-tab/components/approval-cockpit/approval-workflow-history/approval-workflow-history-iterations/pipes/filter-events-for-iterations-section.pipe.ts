import { Pipe, PipeTransform } from '@angular/core';

import {
  ApprovalEventType,
  ApprovalWorkflowEvent,
} from '@gq/shared/models/approval';
@Pipe({
  name: 'filterEventsForIterationsSection',
})
export class FilterEventsForIterationsSectionPipe implements PipeTransform {
  transform(events: ApprovalWorkflowEvent[]) {
    if (!events) {
      return [];
    }

    // events are desc sorted, the last event, which is the very first STARTED/AUTO_APPROVED Event can be ignored
    // it will not be displayed in Iterations Section
    events.pop();

    return events.filter(
      (item: ApprovalWorkflowEvent) => item.event !== ApprovalEventType.RELEASED
    );
  }
}
