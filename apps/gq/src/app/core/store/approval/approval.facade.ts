import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveDirectoryUser } from '@gq/shared/models';
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

  activeDirectoryUsersLoading$: Observable<boolean> = this.store.select(
    approvalFeature.selectActiveDirectoryUsersLoading
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

  activeDirectoryUsers$: Observable<ActiveDirectoryUser[]> = this.store.select(
    approvalFeature.selectActiveDirectoryUsers
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

  /**
   * load all active directory users, which match to the given search expression
   */
  getActiveDirectoryUsers(searchExpression: string): void {
    this.store.dispatch(
      ApprovalActions.getActiveDirectoryUsers({ searchExpression })
    );
  }

  /**
   * Remove all active directory users from the store
   */
  clearActiveDirectoryUsers(): void {
    this.store.dispatch(ApprovalActions.clearActiveDirectoryUsers());
  }
}
