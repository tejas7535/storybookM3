import { Pipe, PipeTransform } from '@angular/core';

import { ActiveDirectoryUser } from '@gq/shared/models';
import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';

@Pipe({
  name: 'userDisplay',
})
export class UserDisplayPipe implements PipeTransform {
  transform(user: ActiveDirectoryUser): string {
    if (!user) {
      return '';
    }

    let displayValue = `(${user.userId.toLocaleUpperCase()}) ${
      user.firstName || ''
    } ${user.lastName || ''}`.trim();

    const approver = user as Approver;

    if (approver.approvalLevel) {
      displayValue = `${displayValue} - ${
        ApprovalLevel[approver.approvalLevel]
      }`;
    }

    return displayValue;
  }
}
