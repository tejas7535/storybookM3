/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { ActiveDirectoryUser, QuotationStatus } from '@gq/shared/models';
import {
  ApprovalCockpitData,
  ApprovalWorkflowInformation,
  Approver,
} from '@gq/shared/models/approval';
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  ActiveCaseActions,
  activeCaseFeature,
  getQuotationStatus,
  getSapId,
  QuotationIdentifier,
} from '../active-case';
import { mapQuotationIdentifierToQueryParamsString } from '../active-case/active-case.utils';
import { ApprovalActions } from './approval.actions';
import { approvalFeature } from './approval.reducer';

@Injectable()
export class ApprovalEffects {
  readonly APPROVAL_COCKPIT_DATA_POLLING_INTERVAL = 5000;

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
        this.store.select(approvalFeature.getApprovalCockpitInformation),
      ]),
      mergeMap(
        ([action, sapId, quotationIdentifier, approvalWorkflowInformation]: [
          ReturnType<typeof ApprovalActions.triggerApprovalWorkflow>,
          string,
          QuotationIdentifier,
          ApprovalWorkflowInformation
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
              approvalLevel: approvalWorkflowInformation.approvalLevel,
              currency: approvalWorkflowInformation.currency,
              autoApproval: approvalWorkflowInformation.autoApproval,
              thirdApproverRequired:
                approvalWorkflowInformation.thirdApproverRequired,
              totalNetValue: approvalWorkflowInformation.totalNetValue,
              gpm: approvalWorkflowInformation.gpm,
              priceDeviation: approvalWorkflowInformation.priceDeviation,
            })
            .pipe(
              tap(() => {
                this.snackBar.open(
                  translate(
                    approvalWorkflowInformation.autoApproval
                      ? `processCaseView.header.releaseModal.snackbar.startWorkflowAutoApproval`
                      : `processCaseView.header.releaseModal.snackbar.startWorkflow`
                  )
                );
              }),
              map((approvalInformation: ApprovalCockpitData) =>
                ApprovalActions.triggerApprovalWorkflowSuccess({
                  approvalInformation,
                })
              ),
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
              tap(() => {
                this.snackBar.open(
                  translate(
                    `processCaseView.header.releaseModal.snackbar.informationSaved`
                  )
                );
              }),
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
              tap(() => {
                this.snackBar.open(
                  translate(
                    `processCaseView.header.releaseModal.snackbar.${action.updateApprovalWorkflowData.updateFunction}`
                  )
                );
              }),
              map((approvalInformation: ApprovalCockpitData) =>
                ApprovalActions.updateApprovalWorkflowSuccess({
                  approvalInformation,
                })
              ),
              catchError((error: Error) =>
                of(ApprovalActions.updateApprovalWorkflowFailure({ error }))
              )
            )
      )
    );
  });

  updateQuotationOnWorkflowEvent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ApprovalActions.updateApprovalWorkflowSuccess,
        ApprovalActions.triggerApprovalWorkflowSuccess
      ),
      map(() => ActiveCaseActions.getQuotation())
    );
  });

  getApprovalCockpitDataForSapQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.getApprovalCockpitData),
      concatLatestFrom(() => [
        this.store.select(approvalFeature.selectApprovalCockpit),
      ]),
      mergeMap(
        ([action, recentApprovalCockpit]: [
          ReturnType<typeof ApprovalActions.getApprovalCockpitData>,
          ApprovalCockpitData
        ]) => {
          if (
            action.forceLoad ||
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

  /**
   * Start approval cockpit data polling if not started yet and if the latest event is not verified.
   */
  handleApprovalCockpitDataPolling$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ApprovalActions.getApprovalCockpitDataSuccess,
        ApprovalActions.approvalCockpitDataAlreadyLoaded,
        ApprovalActions.triggerApprovalWorkflowSuccess,
        ApprovalActions.updateApprovalWorkflowSuccess
      ),
      concatLatestFrom(() => [
        this.store.select(
          approvalFeature.selectPollingApprovalCockpitDataInProgress
        ),
        this.store.select(getQuotationStatus),
        this.store.select(approvalFeature.isLatestApprovalEventVerified),
      ]),
      filter(
        ([
          _action,
          pollingApprovalCockpitDataInProgress,
          quotationStatus,
          isLatestApprovalEventVerified,
        ]: [
          ReturnType<
            | typeof ApprovalActions.getApprovalCockpitDataSuccess
            | typeof ApprovalActions.approvalCockpitDataAlreadyLoaded
            | typeof ApprovalActions.triggerApprovalWorkflowSuccess
            | typeof ApprovalActions.updateApprovalWorkflowSuccess
          >,
          boolean,
          QuotationStatus,
          boolean
        ]) =>
          quotationStatus !== QuotationStatus.ACTIVE &&
          quotationStatus !== QuotationStatus.DELETED &&
          quotationStatus !== QuotationStatus.ARCHIVED &&
          !pollingApprovalCockpitDataInProgress &&
          !isLatestApprovalEventVerified
      ),
      mergeMap(
        ([
          _action,
          _pollingApprovalCockpitDataInProgress,
          _quotationStatus,
          _isLatestApprovalEventVerified,
        ]: [
          ReturnType<
            | typeof ApprovalActions.getApprovalCockpitDataSuccess
            | typeof ApprovalActions.approvalCockpitDataAlreadyLoaded
            | typeof ApprovalActions.triggerApprovalWorkflowSuccess
            | typeof ApprovalActions.updateApprovalWorkflowSuccess
          >,
          boolean,
          QuotationStatus,
          boolean
        ]) => of(ApprovalActions.startPollingApprovalCockpitData())
      )
    );
  });

  startPollingApprovalCockpitDataSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.startPollingApprovalCockpitDataSuccess),
      filter(
        (action) => action.approvalCockpit?.approvalEvents?.at(0).verified
      ), // stop polling if event has been verified
      mergeMap((_action) =>
        of(ApprovalActions.stopPollingApprovalCockpitData())
      )
    );
  });

  startPollingApprovalCockpitData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApprovalActions.startPollingApprovalCockpitData),
      concatLatestFrom(() => this.store.select(getSapId)),
      mergeMap(
        ([_action, sapId]: [
          ReturnType<typeof ApprovalActions.startPollingApprovalCockpitData>,
          string
        ]) =>
          timer(
            // we don't need to start the polling immediately as the status cannot be verified immediately after workflow start or workflow update
            this.APPROVAL_COCKPIT_DATA_POLLING_INTERVAL,
            this.APPROVAL_COCKPIT_DATA_POLLING_INTERVAL
          ).pipe(
            takeUntil(
              this.actions$.pipe(
                ofType(ApprovalActions.stopPollingApprovalCockpitData)
              )
            ),
            switchMap(() =>
              this.approvalService.getApprovalCockpitData(sapId).pipe(
                map((approvalCockpit: ApprovalCockpitData) =>
                  ApprovalActions.startPollingApprovalCockpitDataSuccess({
                    approvalCockpit,
                  })
                ),
                catchError((error: Error) =>
                  of(
                    ApprovalActions.startPollingApprovalCockpitDataFailure({
                      error,
                    }),
                    ApprovalActions.stopPollingApprovalCockpitData() // stop polling on failure
                  )
                )
              )
            )
          )
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly approvalService: ApprovalService,
    private readonly snackBar: MatSnackBar
  ) {}
}
