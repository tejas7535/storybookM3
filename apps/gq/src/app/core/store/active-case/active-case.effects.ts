/* eslint-disable max-lines */
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { from, of, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { ErrorId } from '@gq/shared/http/constants/error-id.enum';
import { URL_SUPPORT } from '@gq/shared/http/constants/urls';
import { Customer, Quotation, QuotationAttachment } from '@gq/shared/models';
import { SapCallInProgress } from '@gq/shared/models/quotation';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import {
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '@gq/shared/models/quotation-detail';
import { AttachmentsService } from '@gq/shared/services/rest/attachments/attachments.service';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { quotationDetailsToRequestData } from '@gq/shared/utils/pricing.utils';
import { translate } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { ApprovalActions } from '../approval/approval.actions';
import { getAddQuotationDetailsRequest } from '../process-case/process-case.selectors';
import { ActiveCaseActions } from './active-case.action';
import { activeCaseFeature } from './active-case.reducer';
import { getGqId } from './active-case.selectors';
import {
  checkEqualityOfIdentifier,
  mapQueryParamsToIdentifier,
} from './active-case.utils';
import {
  AddQuotationDetailsRequest,
  QuotationIdentifier,
  UpdateQuotationDetail,
} from './models';

@Injectable()
export class ActiveCaseEffects {
  private readonly calculationService = inject(CalculationService);
  private readonly actions$ = inject(Actions);
  private readonly customerService = inject(CustomerService);
  private readonly quotationDetailsService = inject(QuotationDetailsService);
  private readonly quotationService = inject(QuotationService);
  private readonly attachmentsService = inject(AttachmentsService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  customerDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getCustomerDetails),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectQuotationIdentifier)
      ),
      map(([_action, quotationIdentifier]) => quotationIdentifier),
      mergeMap((quotationIdentifier: QuotationIdentifier) =>
        this.customerService.getCustomer(quotationIdentifier).pipe(
          map((item: Customer) =>
            ActiveCaseActions.getCustomerDetailsSuccess({
              item,
            })
          ),
          catchError((errorMessage) =>
            of(ActiveCaseActions.getCustomerDetailsFailure({ errorMessage }))
          )
        )
      )
    );
  });

  quotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getQuotation),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectQuotationIdentifier)
      ),
      map(([_action, quotationIdentifier]) => quotationIdentifier),
      mergeMap((quotationIdentifier: QuotationIdentifier) =>
        this.quotationService.getQuotation(quotationIdentifier.gqId).pipe(
          tap((item) => {
            item.quotationDetails.sort(
              (a, b) => a.quotationItemId - b.quotationItemId
            );
          }),
          mergeMap((item: Quotation) => {
            // quotation not fully loaded (async still in progress)
            if (item.calculationInProgress || item.sapCallInProgress) {
              return [ActiveCaseActions.getQuotationSuccess({ item })];
            }

            // If sap quotation is still in sync pending status set interval to refresh sync status
            if (
              item.sapId &&
              item.sapSyncStatus === SAP_SYNC_STATUS.SYNC_PENDING
            ) {
              return [
                ActiveCaseActions.getQuotationSuccess({ item }),
                ActiveCaseActions.getQuotationSuccessFullyCompleted(),
                ActiveCaseActions.getSapSyncStatusInInterval(),
              ];
            }

            // quotation fully loaded, stop timer in quotationInterval$
            return [
              ActiveCaseActions.getQuotationSuccess({ item }),
              ActiveCaseActions.getQuotationSuccessFullyCompleted(),
            ];
          }),
          catchError((errorMessage) =>
            of(ActiveCaseActions.getQuotationFailure({ errorMessage }))
          )
        )
      )
    );
  });

  forbiddenCustomer$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          ActiveCaseActions.getQuotationFailure,
          ActiveCaseActions.getCustomerDetailsFailure
        ),
        filter(
          (action) => +action.errorId === ErrorId.NotAllowedToAccessCustomer
        ),
        tap(() => {
          this.router.navigate([AppRoutePath.ForbiddenCustomerPath]);
        })
      );
    },
    { dispatch: false }
  );

  quotationInterval$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getQuotationInInterval),
      mergeMap(() =>
        timer(0, 60_000).pipe(
          mergeMap(() => from([{ type: ActiveCaseActions.getQuotation.type }])),
          takeUntil(
            this.actions$.pipe(
              ofType(ActiveCaseActions.getQuotationSuccessFullyCompleted)
            )
          )
        )
      )
    );
  });

  triggerDataLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.selectQuotation),
      mergeMap(() => {
        return [
          ActiveCaseActions.getQuotationInInterval(),
          ActiveCaseActions.getCustomerDetails(),
        ];
      })
    );
  });

  loadFromUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) =>
          routerState.url.includes(AppRoutePath.ProcessCaseViewPath) ||
          routerState.url.includes(AppRoutePath.DetailViewPath)
      ),
      mergeMap((routerState) => {
        if (routerState.url.includes(AppRoutePath.DetailViewPath)) {
          return [
            ActiveCaseActions.loadSelectedQuotationDetailFromUrl({
              gqPositionId: routerState.queryParams['gqPositionId'],
            }),
            ActiveCaseActions.loadSelectedQuotationFromUrl({
              queryParams: routerState.queryParams,
            }),
          ];
        }

        return [
          ActiveCaseActions.loadSelectedQuotationFromUrl({
            queryParams: routerState.queryParams,
          }),
        ];
      })
    );
  });

  loadSelectedQuotationDetailFromUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.loadSelectedQuotationDetailFromUrl),
      map((action: any) => action.gqPositionId),
      filter((gqPositionId: string) => {
        if (!gqPositionId) {
          this.router.navigate(['not-found']);
        }

        return gqPositionId !== undefined;
      }),
      map((gqPositionId: string) =>
        ActiveCaseActions.setSelectedQuotationDetail({
          gqPositionId,
        })
      )
    );
  });

  loadSelectedQuotationFromUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.loadSelectedQuotationFromUrl),
      map((action: any) => action.queryParams),
      map((queryParams) => mapQueryParamsToIdentifier(queryParams)),
      filter((quotationIdentifier: QuotationIdentifier) => {
        if (quotationIdentifier === undefined) {
          this.router.navigate(['not-found']);
        }

        return quotationIdentifier !== undefined;
      }),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectQuotationIdentifier)
      ),
      filter(
        ([identifierFromRoute, identifierCurrent]) =>
          !checkEqualityOfIdentifier(identifierFromRoute, identifierCurrent)
      ),
      map(([identifierFromRoute, _identifierCurrent]) => identifierFromRoute),
      map((quotationIdentifier: QuotationIdentifier) =>
        ActiveCaseActions.selectQuotation({ quotationIdentifier })
      )
    );
  });

  removePositionsFromQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.removePositionsFromQuotation),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectRemoveQuotationDetailsIds)
      ),
      map(([_action, qgPositionIds]) => qgPositionIds),
      mergeMap((qgPositionIds: string[]) =>
        this.quotationDetailsService.deleteQuotationDetail(qgPositionIds).pipe(
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.materialDeleted'
            );
            this.snackBar.open(successMessage);
          }),
          map((updatedQuotation) =>
            ActiveCaseActions.removePositionsFromQuotationSuccess({
              updatedQuotation,
            })
          ),
          catchError((errorMessage: HttpErrorResponse) => {
            const errorCodes = (
              errorMessage.error as Quotation
            )?.quotationDetails
              ?.map(
                (quotationDetail: QuotationDetail) =>
                  quotationDetail.sapSyncErrorCode?.code
              )
              .filter((errorCode: string) => !!errorCode);

            if (errorCodes?.length > 0) {
              const messageText = `shared.sapStatusLabels.errorCodes.${errorCodes[0]}`;
              this.snackBar
                .open(
                  translate(messageText),
                  translate('errorInterceptorActionDefault'),
                  {
                    duration: 5000,
                  }
                )
                .onAction()
                .subscribe(() => window.open(URL_SUPPORT, '_blank')?.focus());
            }

            return of(
              ActiveCaseActions.removePositionsFromQuotationFailure({
                errorMessage: errorMessage.message,
                updatedQuotation: errorMessage.error,
              })
            );
          })
        )
      )
    );
  });

  addMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.addMaterialsToQuotation),
      concatLatestFrom(() => this.store.select(getAddQuotationDetailsRequest)),
      map(
        ([_action, addQuotationDetailsRequest]) => addQuotationDetailsRequest
      ),
      mergeMap((addQuotationDetailsRequest: AddQuotationDetailsRequest) =>
        this.quotationDetailsService
          .addQuotationDetails(addQuotationDetailsRequest)
          .pipe(
            tap(() => {
              const successMessage = translate(
                'shared.snackBarMessages.materialAdded'
              );
              this.snackBar.open(successMessage);
            }),
            map((updatedQuotation) =>
              ActiveCaseActions.addMaterialsToQuotationSuccess({
                updatedQuotation,
              })
            ),
            catchError((errorMessage) =>
              of(
                ActiveCaseActions.addMaterialsToQuotationFailure({
                  errorMessage,
                })
              )
            )
          )
      )
    );
  });

  updateQuotationDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.updateQuotationDetails),
      map((action: any) => action.updateQuotationDetailList),
      mergeMap((updateQuotationDetailList: UpdateQuotationDetail[]) =>
        this.quotationDetailsService
          .updateQuotationDetail(updateQuotationDetailList)
          .pipe(
            tap((quotation) => {
              // check if the update of the detail leads to an update of the gqPrice
              const updatesGqPrice = this.checkGqPriceAffectedByUpdate(
                updateQuotationDetailList,
                quotation
              );

              this.showUpdateQuotationDetailToast(
                updateQuotationDetailList[0],
                updatesGqPrice
              );
            }),
            map((updatedQuotation) =>
              ActiveCaseActions.updateQuotationDetailsSuccess({
                updatedQuotation,
              })
            ),
            catchError((errorMessage) =>
              of(
                ActiveCaseActions.updateQuotationDetailsFailure({
                  errorMessage,
                })
              )
            )
          )
      )
    );
  });

  uploadSelectionToSap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.uploadSelectionToSap),
      map((action) => action.gqPositionIds),
      mergeMap((gqPositionIds: string[]) =>
        this.quotationService.uploadSelectionToSap(gqPositionIds).pipe(
          mergeMap((updatedQuotation: Quotation) => [
            ActiveCaseActions.uploadSelectionToSapSuccess({
              updatedQuotation,
            }),
            ActiveCaseActions.getSapSyncStatusInInterval(), // get SAP sync status periodically
          ]),
          catchError((errorMessage) =>
            of(ActiveCaseActions.uploadSelectionToSapFailure({ errorMessage }))
          )
        )
      )
    );
  });

  // get approval data whenever we have a SAP quotation or the SAP quotation has been updated
  getApprovalCockpitData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ActiveCaseActions.getQuotationSuccess,
        ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted
      ),
      map((action) => {
        return ActiveCaseActions.getQuotationSuccess.type === action.type
          ? action.item.sapId
          : action.result.sapId;
      }),
      mergeMap((sapId) => [
        sapId === undefined
          ? ApprovalActions.clearApprovalCockpitData()
          : ApprovalActions.getApprovalCockpitData({
              sapId,
              forceLoad: true,
            }),
      ])
    );
  });

  refreshSapPricing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.refreshSapPricing),
      concatLatestFrom(() => this.store.select(getGqId)),
      map(([_action, gqId]) => gqId),
      mergeMap((gqId: number) =>
        this.quotationService.refreshSapPricing(gqId).pipe(
          tap((resp) => {
            let successMessage = '';

            successMessage =
              resp.sapCallInProgress ===
              SapCallInProgress.FETCH_DATA_IN_PROGRESS
                ? translate(
                    'shared.snackBarMessages.refreshSapPricingSuccessAsync'
                  )
                : translate('shared.snackBarMessages.refreshSapPricingSuccess');

            this.snackBar.open(successMessage);
          }),
          mergeMap((quotation) => {
            if (quotation.sapCallInProgress) {
              return [
                ActiveCaseActions.refreshSapPricingSuccess({ quotation }),
                ActiveCaseActions.getQuotationInInterval(),
              ];
            }

            return [ActiveCaseActions.refreshSapPricingSuccess({ quotation })];
          }),
          catchError((errorMessage) =>
            of(ActiveCaseActions.refreshSapPricingFailure({ errorMessage }))
          )
        )
      )
    );
  });

  updateQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.updateQuotation),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(([action, gqId]) =>
        this.quotationService
          .updateQuotation(
            {
              caseName: action.caseName,
              currency: action.currency,
              quotationToDate: action.quotationToDate,
              validTo: action.validTo,
              customerPurchaseOrderDate: action.customerPurchaseOrderDate,
              customerInquiryDate: action.customerInquiryDate,
              requestedDelDate: action.requestedDelDate,
              shipToParty: action.shipToParty,
              purchaseOrderTypeId: action.purchaseOrderTypeId,
              partnerRoleId: action.partnerRoleId,
              offerTypeId: action.offerTypeId,
            },
            gqId
          )
          .pipe(
            map((quotation: Quotation) =>
              ActiveCaseActions.updateQuotationSuccess({ quotation })
            ),
            catchError((errorMessage) =>
              of(ActiveCaseActions.updateQuotationFailure({ errorMessage }))
            )
          )
      )
    );
  });

  createSapQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.createSapQuote),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(
        ([action, gqId]: [
          ReturnType<typeof ActiveCaseActions.createSapQuote>,
          number,
        ]) =>
          this.quotationService
            .createSapQuotation(gqId, action.gqPositionIds)
            .pipe(
              tap((quotation: Quotation) => {
                this.showErrorToastOnFailedRequest(
                  quotation.sapId,
                  quotation.sapSyncStatus
                );
              }),
              mergeMap((quotation: Quotation) => {
                const actions: Action[] = [
                  ActiveCaseActions.createSapQuoteSuccess({ quotation }),
                ];

                if (
                  quotation.sapCallInProgress ===
                    SapCallInProgress.FETCH_DATA_IN_PROGRESS ||
                  quotation.calculationInProgress
                ) {
                  // if the quotation calculation or sapCall is still in progress, set interval to refresh the quotation
                  actions.push(ActiveCaseActions.getQuotationInInterval());
                } else if (
                  quotation.sapSyncStatus === SAP_SYNC_STATUS.SYNC_PENDING
                ) {
                  // if quotation is pending, set interval to refresh the sap sync status
                  actions.push(ActiveCaseActions.getSapSyncStatusInInterval());
                }

                return actions;
              }),
              catchError((errorMessage) =>
                of(ActiveCaseActions.createSapQuoteFailure({ errorMessage }))
              )
            )
      )
    );
  });

  updateCosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.updateCosts),
      concatMap((action: ReturnType<typeof ActiveCaseActions.updateCosts>) =>
        this.quotationDetailsService.updateCostData(action.gqPosId).pipe(
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.costsUpdated'
            );
            this.snackBar.open(successMessage);
          }),
          map((updatedQuotation: Quotation) =>
            ActiveCaseActions.updateCostsSuccess({ updatedQuotation })
          ),
          catchError((errorMessage) =>
            of(ActiveCaseActions.updateCostsFailure({ errorMessage }))
          )
        )
      )
    );
  });
  updateRfqInformation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.updateRFQInformation),
      concatMap(
        (action: ReturnType<typeof ActiveCaseActions.updateRFQInformation>) =>
          this.quotationDetailsService
            .updateRfqInformation(action.gqPosId)
            .pipe(
              tap(() => {
                const successMessage = translate(
                  'shared.snackBarMessages.rfqInformationUpdated'
                );
                this.snackBar.open(successMessage);
              }),
              map((updatedQuotation: Quotation) =>
                ActiveCaseActions.updateRFQInformationSuccess({
                  updatedQuotation,
                })
              ),
              catchError((errorMessage) =>
                of(
                  ActiveCaseActions.updateRFQInformationFailure({
                    errorMessage,
                  })
                )
              )
            )
      )
    );
  });
  uploadAttachments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.uploadAttachments),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(([action, gqId]) =>
        this.attachmentsService.uploadQuotationFiles(action.files, gqId).pipe(
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.attachmentsUploaded'
            );
            this.snackBar.open(successMessage);
          }),
          map((attachments: QuotationAttachment[]) =>
            ActiveCaseActions.uploadAttachmentsSuccess({ attachments })
          ),
          catchError((errorMessage) =>
            of(ActiveCaseActions.uploadAttachmentsFailure({ errorMessage }))
          )
        )
      )
    );
  });

  getAllAttachments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getAllAttachments),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(([_action, gqId]) =>
        this.attachmentsService
          // when action.gqId is different to the action
          .getAllAttachments(gqId)
          .pipe(
            map((attachments: QuotationAttachment[]) =>
              ActiveCaseActions.getAllAttachmentsSuccess({ attachments })
            ),
            catchError((errorMessage) =>
              of(ActiveCaseActions.getAllAttachmentsFailure({ errorMessage }))
            )
          )
      )
    );
  });

  downloadAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.downloadAttachment),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(([action]) =>
        this.attachmentsService
          .downloadQuotationAttachment(action.attachment)
          .pipe(
            map((fileName: string) => {
              return ActiveCaseActions.downloadAttachmentSuccess({
                fileName,
              });
            }),
            catchError((errorMessage) =>
              of(ActiveCaseActions.downloadAttachmentFailure({ errorMessage }))
            )
          )
      )
    );
  });
  deleteAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.deleteAttachment),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(([action]) =>
        this.attachmentsService.deleteAttachment(action.attachment).pipe(
          tap(() => {
            const deletedSuccessfullyMessage = translate(
              'shared.snackBarMessages.attachmentsDeleted'
            );
            this.snackBar.open(deletedSuccessfullyMessage);
          }),
          map((attachments: QuotationAttachment[]) =>
            ActiveCaseActions.deleteAttachmentSuccess({ attachments })
          ),
          catchError((errorMessage) =>
            of(ActiveCaseActions.deleteAttachmentFailed({ errorMessage }))
          )
        )
      )
    );
  });

  getQuotationPricingOverview$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.getQuotationPricingOverview),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectQuotation)
      ),
      map(([_action, quotation]) => quotation?.quotationDetails),
      mergeMap((quotationDetails: QuotationDetail[]) =>
        this.calculationService
          .getQuotationKpiCalculation(
            quotationDetailsToRequestData(quotationDetails)
          )
          .pipe(
            map((priceInformation: QuotationDetailsSummaryKpi) => {
              const avgRatingItems = quotationDetails
                .filter((item: QuotationDetail) => !!item && item.gqRating)
                .map((item: QuotationDetail) => item.gqRating);
              const avgRating = Math.round(
                avgRatingItems.reduce((sum: number, x: number) => sum + x, 0) /
                  avgRatingItems.length
              );

              const result = {
                gpi: { value: priceInformation.totalWeightedAverageGpi },
                gpm: { value: priceInformation.totalWeightedAverageGpm },
                netValue: { value: priceInformation.totalNetValue },
                avgGqRating: { value: avgRating },
                deviation: {
                  value: priceInformation.totalWeightedAveragePriceDiff,
                },
              };

              return ActiveCaseActions.getQuotationPricingOverviewSuccess({
                result,
              });
            }),
            catchError((errorMessage) =>
              of(
                ActiveCaseActions.getQuotationPricingOverviewFailure({
                  errorMessage,
                })
              )
            )
          )
      )
    );
  });

  private checkGqPriceAffectedByUpdate(
    updateQuotationDetailList: UpdateQuotationDetail[],
    quotation: Quotation
  ) {
    const updatedDetailIds = new Set(
      updateQuotationDetailList.map((item) => item.gqPositionId)
    );

    return (
      quotation.quotationDetails
        .filter((detail) => updatedDetailIds.has(detail.gqPositionId))
        .findIndex((detail) => detail.recommendedPrice) > -1
    );
  }

  private showErrorToastOnFailedRequest(
    sapId: string,
    sapSyncStatus: SAP_SYNC_STATUS
  ) {
    if (sapSyncStatus === SAP_SYNC_STATUS.SYNC_FAILED) {
      const errorMessage = translate(
        `shared.snackBarMessages.createSapQuoteSync.failed`,
        {
          sapId,
        }
      );
      this.snackBar.open(errorMessage);
    }
  }

  private showUpdateQuotationDetailToast(
    update: UpdateQuotationDetail,
    updatesGqPrice: boolean
  ): void {
    let translateString = `shared.snackBarMessages.`;
    if (update.price) {
      translateString += 'updateSelectedPrice';
    } else if (update.orderQuantity) {
      translateString += updatesGqPrice
        ? 'updateQuantityAffectsGqPrice'
        : 'updateQuantity';
    } else if (update.targetPrice || update.targetPriceSource) {
      translateString += 'updateTargetPrice';
    } else if (update.comment) {
      translateString += 'updateComment';
    } else if (update.customerMaterial) {
      translateString += 'updateCustomerMaterial';
    }
    this.snackBar.open(translate(translateString));
  }
}
