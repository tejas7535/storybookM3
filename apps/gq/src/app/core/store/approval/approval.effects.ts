import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { ActiveDirectoryUser } from '@gq/shared/models';
import { ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';
import { approvalFeature } from './approval.reducer';

@Injectable()
export class ApprovalEffects {
  getAllApprovers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.getAllApprovers),
      concatLatestFrom(() =>
        this.store.select(approvalFeature.selectApprovers)
      ),
      mergeMap(
        ([_action, allApprovers]: [
          ReturnType<typeof ApprovalActions.getAllApprovers>,
          Approver[]
        ]) => {
          if (!allApprovers || allApprovers.length === 0) {
            return this.approvalService.getAllApprovers().pipe(
              map((approvers: Approver[]) =>
                ApprovalActions.getAllApproversSuccess({ approvers })
              ),
              catchError((error: Error) =>
                of(ApprovalActions.getAllApproversFailure({ error }))
              )
            );
          }

          return of(ApprovalActions.allApproversAlreadyLoaded());
        }
      )
    );
  });

  getApprovalStatusOfSapQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.getApprovalStatus),
      concatLatestFrom(() =>
        this.store.select(approvalFeature.selectApprovalStatus)
      ),
      mergeMap(
        ([action, recentApprovalStatus]: [
          ReturnType<typeof ApprovalActions.getApprovalStatus>,
          ApprovalStatus
        ]) => {
          if (
            !recentApprovalStatus?.sapId ||
            recentApprovalStatus?.sapId !== action.sapId
          ) {
            return this.approvalService.getApprovalStatus(action.sapId).pipe(
              map((approvalStatus: ApprovalStatus) =>
                ApprovalActions.getApprovalStatusSuccess({ approvalStatus })
              ),
              catchError((error: Error) =>
                of(ApprovalActions.getApprovalStatusFailure({ error }))
              )
            );
          }

          return of(ApprovalActions.approvalStatusAlreadyLoaded());
        }
      )
    );
  });

  getActiveDirectoryUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.getActiveDirectoryUsers),
      mergeMap((action) => {
        return this.approvalService
          .getActiveDirectoryUsers(action.searchExpression)
          .pipe(
            map((activeDirectoryUsers: ActiveDirectoryUser[]) =>
              ApprovalActions.getActiveDirectoryUsersSuccess({
                activeDirectoryUsers,
              })
            ),
            catchError((error: Error) =>
              of(ApprovalActions.getActiveDirectoryUsersFailure({ error }))
            )
          );
      })
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly approvalService: ApprovalService
  ) {}
}
