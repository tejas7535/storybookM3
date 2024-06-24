/* eslint-disable max-lines */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import {
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '@gq/shared/models/quotation-detail';
import { AttachmentsService } from '@gq/shared/services/rest/attachments/attachments.service';
import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { translate } from '@jsverse/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';

import { AppRoutePath } from '../../../app-route-path.enum';
import { ApprovalActions } from '../approval/approval.actions';
import { getAddQuotationDetailsRequest } from '../process-case/process-case.selectors';
import { ActiveCaseActions } from './active-case.action';
import { activeCaseFeature } from './active-case.reducer';
import { getGqId } from './active-case.selectors';
import {
  addCalculationsForDetails,
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

            addCalculationsForDetails(item.quotationDetails);
          }),
          mergeMap((item: Quotation) => {
            // quotation not fully loaded (async still in progress)
            if (item.calculationInProgress || item.sapCallInProgress) {
              return [ActiveCaseActions.getQuotationSuccess({ item })];
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
          (action) => +action.errorId === ErrorId.NotAllowdToAccessCustomer
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

  resetSimulatedQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState) =>
        routerState.url.includes(AppRoutePath.ProcessCaseViewPath)
      ),
      mergeMap(() => {
        return [ActiveCaseActions.resetSimulatedQuotation()];
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
          tap((item) => addCalculationsForDetails(item.quotationDetails)),
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
                  quotationDetail.sapSyncErrorCode
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
            tap((item) => addCalculationsForDetails(item.quotationDetails)),
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
            tap((quotation) => {
              addCalculationsForDetails(quotation.quotationDetails);
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
          tap((quotation) => {
            this.showUploadSelectionToast(quotation, gqPositionIds);
          }),
          tap((quotation) => {
            addCalculationsForDetails(quotation.quotationDetails);
          }),
          mergeMap((updatedQuotation: Quotation) => [
            ActiveCaseActions.uploadSelectionToSapSuccess({ updatedQuotation }),
            ApprovalActions.getApprovalCockpitData({
              sapId: updatedQuotation.sapId,
              forceLoad: true,
            }),
          ]),
          catchError((errorMessage) =>
            of(ActiveCaseActions.uploadSelectionToSapFailure({ errorMessage }))
          )
        )
      )
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
          tap((item) => addCalculationsForDetails(item.quotationDetails)),
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
              requestedDelDate: action.requestedDelDate,
              shipToParty: action.shipToParty,
              purchaseOrderTypeId: action.purchaseOrderTypeId,
              partnerRoleId: action.partnerRoleId,
            },
            gqId
          )
          .pipe(
            tap((item) => addCalculationsForDetails(item.quotationDetails)),
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

  confirmSimulatedQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveCaseActions.confirmSimulatedQuotation),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectSimulatedItem)
      ),
      map(([_action, simulatedQuotation]) => simulatedQuotation),
      mergeMap((simulatedQuotation) => {
        const updateQuotationDetailList: UpdateQuotationDetail[] =
          simulatedQuotation.quotationDetails.map((detail) => ({
            gqPositionId: detail.gqPositionId,
            price: detail.price,
            priceSource: detail.priceSource,
          }));

        return [
          ActiveCaseActions.updateQuotationDetails({
            updateQuotationDetailList,
          }),
          ActiveCaseActions.resetSimulatedQuotation(),
        ];
      })
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
                this.showCreateSapQuoteToast(quotation);
              }),
              tap((quotation) =>
                addCalculationsForDetails(quotation.quotationDetails)
              ),
              mergeMap((quotation: Quotation) => {
                if (
                  quotation.sapCallInProgress ||
                  quotation.calculationInProgress
                ) {
                  return [
                    ActiveCaseActions.createSapQuoteSuccess({ quotation }),
                    ActiveCaseActions.getQuotationInInterval(),
                  ];
                }

                return [ActiveCaseActions.createSapQuoteSuccess({ quotation })];
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
          tap((item: Quotation) =>
            addCalculationsForDetails(item.quotationDetails)
          ),
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
              tap((item: Quotation) =>
                addCalculationsForDetails(item.quotationDetails)
              ),
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
        this.attachmentsService.uploadFiles(action.files, gqId).pipe(
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
        this.attachmentsService.downloadAttachment(action.attachment).pipe(
          map((attachmentBlob: Blob) => {
            saveAs(attachmentBlob, action.attachment.fileName);

            return ActiveCaseActions.downloadAttachmentSuccess({
              fileName: action.attachment.fileName,
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
  constructor(
    private readonly actions$: Actions,
    private readonly customerService: CustomerService,
    private readonly quotationDetailsService: QuotationDetailsService,
    private readonly quotationService: QuotationService,
    private readonly attachmentsService: AttachmentsService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

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

  private showUploadSelectionToast(
    quotation: Quotation,
    syncedPositionIds: string[]
  ): void {
    if (!(quotation.sapCallInProgress === SapCallInProgress.NONE_IN_PROGRESS)) {
      return;
    }

    const updatedDetails = quotation.quotationDetails.filter((detail) =>
      syncedPositionIds.includes(detail.gqPositionId)
    );
    const syncInSapStatus = updatedDetails.map((e) => e.syncInSap);
    let translateKey;

    if (syncInSapStatus.every(Boolean)) {
      translateKey = 'full';
    } else if (syncInSapStatus.some(Boolean)) {
      translateKey = 'partially';
    } else {
      translateKey = 'failed';
    }
    const successMessage = translate(
      `shared.snackBarMessages.uploadToSapSync.${translateKey}`
    );
    this.snackBar.open(successMessage);
  }

  private showCreateSapQuoteToast(quotation: Quotation) {
    if (!(quotation.sapCallInProgress === SapCallInProgress.NONE_IN_PROGRESS)) {
      return;
    }

    let translateKey;
    if (quotation.sapSyncStatus === SAP_SYNC_STATUS.SYNCED) {
      translateKey = 'full';
    } else if (quotation.sapSyncStatus === SAP_SYNC_STATUS.PARTIALLY_SYNCED) {
      translateKey = 'partially';
    } else {
      translateKey = 'failed';
    }

    const successMessage = translate(
      `shared.snackBarMessages.createSapQuoteSync.${translateKey}`,
      {
        sapId: quotation.sapId,
      }
    );
    this.snackBar.open(successMessage);
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
    } else if (update.targetPrice) {
      translateString += 'updateTargetPrice';
    } else {
      translateString += 'updateComment';
    }
    this.snackBar.open(translate(translateString));
  }
}
