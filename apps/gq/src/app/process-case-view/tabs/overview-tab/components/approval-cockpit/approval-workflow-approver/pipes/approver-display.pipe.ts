import { Pipe, PipeTransform } from '@angular/core';

import { ApprovalLevel, Approver } from '@gq/shared/models';

@Pipe({
  name: 'approverDisplay',
  standalone: false,
})
export class ApproverDisplayPipe implements PipeTransform {
  transform(user: Approver, unknownApproverLevelText: string): string {
    if (!user) {
      return '';
    }

    return `${user.firstName ?? ''} ${user.lastName ?? ''} (${
      ApprovalLevel[user.approvalLevel] ?? unknownApproverLevelText
    })`;
  }
}
