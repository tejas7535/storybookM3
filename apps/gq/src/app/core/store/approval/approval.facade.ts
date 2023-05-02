import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

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

  public allApprovers$: Observable<Approver[]> = this.store.select(
    approvalFeature.selectApprovers
  );

  public levelOneApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getAllLevelOneApprovers
  );

  public levelTwoApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getAllLevelTwoApprovers
  );

  public levelThreeApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getAllLevelThreeApprovers
  );

  public levelFourApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getAllLevelFourApprovers
  );

  public levelFiveApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getAllLevelFiveApprovers
  );

  public getAllApprovers(): void {
    this.store.dispatch(ApprovalActions.getAllApprovers());
  }
}
