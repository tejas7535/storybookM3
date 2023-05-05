import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { Approver } from '@gq/shared/models/quotation/approver.model';

import { ApprovalPaths } from './approval-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  constructor(private readonly http: HttpClient) {}

  public getAllApprovers(): Observable<Approver[]> {
    return this.http.get<Approver[]>(
      `${ApiVersion.V1}/${ApprovalPaths.PATH_APPROVAL}/${ApprovalPaths.PATH_APPROVERS}`
    );
  }
}
