import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { ActiveDirectoryUser } from '@gq/shared/models';
import {
  ApprovalCockpitData,
  ApprovalStatus,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
} from '@gq/shared/models/approval';
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  activeCaseFeature,
  getSapId,
  QuotationIdentifier,
} from '../active-case';
import { mapQuotationIdentifierToQueryParamsString } from '../active-case/active-case.utils';
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

  triggerApprovalWorkflow$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.triggerApprovalWorkflow),
      concatLatestFrom(() => [
        this.store.select(getSapId),
        this.store.select(activeCaseFeature.selectQuotationIdentifier),
      ]),
      mergeMap(
        ([action, sapId, quotationIdentifier]: [
          ReturnType<typeof ApprovalActions.triggerApprovalWorkflow>,
          string,
          QuotationIdentifier
        ]) => {
          const gqLink = `${window.location.protocol}//${
            window.location.hostname
          }/${AppRoutePath.ProcessCaseViewPath}/${
            ProcessCaseRoutePath.OverviewPath
          }?${mapQuotationIdentifierToQueryParamsString(quotationIdentifier)}`;

          return this.approvalService
            .triggerApprovalWorkflow(sapId, {
              ...action.approvalWorkflowData,
              gqId: quotationIdentifier.gqId,
              gqLinkBase64Encoded: window.btoa(gqLink), // needs to be encoded as base64, otherwise the request is blocked by the gateway
            })
            .pipe(
              map(() => ApprovalActions.triggerApprovalWorkflowSuccess()),
              catchError((error: Error) =>
                of(ApprovalActions.triggerApprovalWorkflowFailure({ error }))
              )
            );
        }
      )
    );
  });

  saveApprovalWorkflowInformation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.saveApprovalWorkflowInformation),
      concatLatestFrom(() => [
        this.store.select(getSapId),
        this.store.select(activeCaseFeature.selectQuotationIdentifier),
      ]),
      mergeMap(
        ([action, sapId, quotationIdentifier]: [
          ReturnType<typeof ApprovalActions.saveApprovalWorkflowInformation>,
          string,
          QuotationIdentifier
        ]) =>
          this.approvalService
            .saveApprovalWorkflowInformation(sapId, {
              ...action.approvalWorkflowInformation,
              gqId: quotationIdentifier.gqId,
            })
            .pipe(
              map((approvalGeneral: ApprovalWorkflowInformation) =>
                ApprovalActions.saveApprovalWorkflowInformationSuccess({
                  approvalGeneral,
                })
              ),
              catchError((error: Error) =>
                of(
                  ApprovalActions.saveApprovalWorkflowInformationFailure({
                    error,
                  })
                )
              )
            )
      )
    );
  });

  updateApprovalWorkflow$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.updateApprovalWorkflow),
      concatLatestFrom(() => [
        this.store.select(getSapId),
        this.store.select(activeCaseFeature.selectQuotationIdentifier),
      ]),
      mergeMap(
        ([action, sapId, quotationIdentifier]: [
          ReturnType<typeof ApprovalActions.updateApprovalWorkflow>,
          string,
          QuotationIdentifier
        ]) =>
          this.approvalService
            .updateApprovalWorkflow(sapId, {
              ...action.updateApprovalWorkflowData,
              gqId: quotationIdentifier.gqId,
            })
            .pipe(
              map((approvalEvent: ApprovalWorkflowEvent) =>
                ApprovalActions.updateApprovalWorkflowSuccess({ approvalEvent })
              ),
              catchError((error: Error) =>
                of(ApprovalActions.updateApprovalWorkflowFailure({ error }))
              )
            )
      )
    );
  });

  getApprovalCockpitDataForSapQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.getApprovalCockpitData),
      concatLatestFrom(() =>
        this.store.select(approvalFeature.selectApprovalCockpit)
      ),
      mergeMap(
        ([action, recentApprovalCockpit]: [
          ReturnType<typeof ApprovalActions.getApprovalCockpitData>,
          ApprovalCockpitData
        ]) => {
          if (
            !recentApprovalCockpit?.approvalGeneral?.sapId ||
            recentApprovalCockpit?.approvalGeneral?.sapId !== action.sapId
          ) {
            return this.approvalService
              .getApprovalCockpitData(action.sapId)
              .pipe(
                map((approvalCockpit: ApprovalCockpitData) =>
                  ApprovalActions.getApprovalCockpitDataSuccess({
                    approvalCockpit,
                  })
                ),
                catchError((error: Error) =>
                  of(ApprovalActions.getApprovalCockpitDataFailure({ error }))
                )
              );
          }

          return of(ApprovalActions.approvalCockpitDataAlreadyLoaded());
        }
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly approvalService: ApprovalService
  ) {}
}
