import { Pipe, PipeTransform } from '@angular/core';

import {
  ActiveDirectoryUser,
  ApprovalLevel,
  Approver,
} from '@gq/shared/models';

@Pipe({
  name: 'userDisplay',
  standalone: false,
})
export class UserDisplayPipe implements PipeTransform {
  transform(user: ActiveDirectoryUser, excludeUserId?: boolean): string {
    if (!user) {
      return '';
    }
    let displayValue = '';
    if (!excludeUserId) {
      displayValue += `(${user.userId.toLocaleUpperCase()}) `;
    }
    displayValue += `${user.firstName || ''} ${user.lastName || ''}`;

    const approver = user as Approver;

    if (approver.approvalLevel) {
      displayValue = `${displayValue} - ${
        ApprovalLevel[approver.approvalLevel]
      }`;
    }

    return displayValue.trim();
  }
}
