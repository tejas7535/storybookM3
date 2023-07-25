import { Pipe, PipeTransform } from '@angular/core';
import {
  ApprovalEventType,
  ApprovalWorkflowEvent,
} from '@gq/shared/models/approval';
@Pipe({
  name: 'filterStartRelease',
})
export class FilterStartReleaseEventsPipe implements PipeTransform {
  transform(events: ApprovalWorkflowEvent[]) {
    if (!events) {
      return [];
    }

    return events.filter(
      (item: ApprovalWorkflowEvent) =>
        item.event !== ApprovalEventType.STARTED &&
        item.event !== ApprovalEventType.RELEASED
    );
  }
}
