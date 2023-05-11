import { Pipe, PipeTransform } from '@angular/core';

import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';

@Pipe({
  name: 'approverDisplay',
})
export class ApproverDisplayPipe implements PipeTransform {
  transform(approver: Approver): string {
    return approver
      ? `(${approver.userId.toLocaleUpperCase()}) ${approver.firstName} ${
          approver.lastName
        } - ${ApprovalLevel[approver.approvalLevel]}`
      : '';
  }
}
