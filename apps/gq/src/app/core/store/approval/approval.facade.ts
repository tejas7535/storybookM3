import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApprovalLevel } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { Store } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';
import * as fromApprovalSelectors from './approval.selectors';
@Injectable({
  providedIn: 'root',
})
export class ApprovalFacade {
  constructor(private readonly store: Store) {}

  public levelOneApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getApproversOfLevel(ApprovalLevel.L1)
  );

  public levelTwoApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getApproversOfLevel(ApprovalLevel.L2)
  );

  public levelThreeApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getApproversOfLevel(ApprovalLevel.L3)
  );

  public levelFourApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getApproversOfLevel(ApprovalLevel.L4)
  );

  public levelFiveApprovers$: Observable<Approver[]> = this.store.select(
    fromApprovalSelectors.getApproversOfLevel(ApprovalLevel.L5)
  );

  public getApprovers(): void {
    this.store.dispatch(ApprovalActions.getAllApprovers());
  }
}
