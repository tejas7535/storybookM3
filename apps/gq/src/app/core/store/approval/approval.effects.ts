import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ApprovalActions } from './approval.actions';

@Injectable()
export class ApprovalEffects {
  getAllApprovers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.getAllApprovers),
      mergeMap(() =>
        this.approvalService.getAllApprovers().pipe(
          map((approvers: Approver[]) =>
            ApprovalActions.getAllApproversSuccess({ approvers })
          ),
          catchError((error: Error) =>
            of(ApprovalActions.getAllApproversFailure({ error }))
          )
        )
      )
    );
  });

  getApprovalStatusOfSapQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.getApprovalStatus),
      mergeMap((action) =>
        this.approvalService.getApprovalStatus(action.sapId).pipe(
          map((approvalStatus: ApprovalStatus) =>
            ApprovalActions.getApprovalStatusSuccess({ approvalStatus })
          ),
          catchError((error: Error) =>
            of(ApprovalActions.getApprovalStatusFailure({ error }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly approvalService: ApprovalService
  ) {}
}
