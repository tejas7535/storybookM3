import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApprovalLevel, ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { Store } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';
import { approvalFeature } from './approval.reducer';
import * as fromApprovalSelectors from './approval.selectors';
@Injectable({
  providedIn: 'root',
})
export class ApprovalFacade {
  constructor(private readonly store: Store) {}

  approvalStatusLoading$: Observable<boolean> = this.store.select(
    approvalFeature.selectApprovalStatusLoading
  );

  allApproversLoading$: Observable<boolean> = this.store.select(
    approvalFeature.selectApproversLoading
  );

  firstApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getFirstApprovers
  );

  secondApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getSecondApprovers
  );

  thirdApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getThirdApprovers
  );

  approvalLevelFirstApprover$: Observable<ApprovalLevel> = this.store.select(
    fromApprovalSelectors.getApprovalLevelFirstApprover
  );

  approvalLevelSecondApprover$: Observable<ApprovalLevel> = this.store.select(
    fromApprovalSelectors.getApprovalLevelSecondApprover
  );

  approvalLevelThirdApprover$: Observable<ApprovalLevel> = this.store.select(
    fromApprovalSelectors.getApprovalLevelThirdApprover
  );

  requiredApprovalLevelsForQuotation$: Observable<string> = this.store.select(
    fromApprovalSelectors.getRequiredApprovalLevelsForQuotation
  );

  // will be replace with all users later with another Ticket
  allUsers$: Observable<Approver[]> = this.store.select(
    approvalFeature.selectApprovers
  );

  approvalStatus$: Observable<ApprovalStatus> = this.store.select(
    approvalFeature.selectApprovalStatus
  );

  /**
   * load all available approvers
   */
  getApprovers(): void {
    this.store.dispatch(ApprovalActions.getAllApprovers());
  }

  /**
   * get information about approval status fro given sapId
   *
   * @param sapId sap Id of quotation
   */
  getApprovalStatus(sapId: string): void {
    return sapId
      ? this.store.dispatch(ApprovalActions.getApprovalStatus({ sapId }))
      : this.store.dispatch(ApprovalActions.clearApprovalStatus());
  }

  /**
   * Loads all Information needed for approval workflow.
   * Contains all available approvers and approval Status of given sap Id.
   *
   * @param sapId sap Id of quotation
   */
  getApprovalWorkflowData(sapId: string): void {
    this.getApprovers();
    this.getApprovalStatus(sapId);
  }
}
