import { Pipe, PipeTransform } from '@angular/core';

import {
  ActiveDirectoryUser,
  ApprovalLevel,
  Approver,
} from '@gq/shared/models';

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
