import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ApprovalLevel } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';

// TODO: class can be deleted when real service exists
@Injectable({
  providedIn: 'root',
})
/* istanbul ignore file */
export class ApprovalService {
  public getAllApprovers(): Observable<Approver[]> {
    return of([
      {
        userId: 'schlesni',
        firstName: 'Stefanie',
        lastName: 'Schleer',
        approvalLevel: ApprovalLevel.L2,
      },
      {
        userId: 'soehnpsc',
        firstName: 'Pascal',
        lastName: 'Soehnlein',
        approvalLevel: ApprovalLevel.L5,
      },
    ]);
  }
}
