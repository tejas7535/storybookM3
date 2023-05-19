import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { ApprovalStatus } from '@gq/shared/models/quotation/approval-status.model';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { withCache } from '@ngneat/cashew';

import { ApprovalPaths } from './approval-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  constructor(private readonly http: HttpClient) {}

  /**
   * get All SAP Approvers
   *
   * @returns a list with available approvers
   */
  getAllApprovers(): Observable<Approver[]> {
    return this.http.get<Approver[]>(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVERS}`,
      {
        context: withCache(),
      }
    );
  }

  /**
   * get the status of the SAP quotation
   *
   * @param sapId the Id from SAP
   * @returns the approval status of SAP
   */
  getApprovalStatus(sapId: string): Observable<ApprovalStatus> {
    return this.http.get<ApprovalStatus>(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVAL_STATUS}/${sapId}`
    );
  }
}
