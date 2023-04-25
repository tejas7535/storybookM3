/* eslint-disable max-lines */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { from, of, timer } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { MaterialTableItem } from '@gq/shared/models/table';
import {
  MaterialValidationRequest,
  MaterialValidationResponse,
} from '@gq/shared/services/rest/material/models';
import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { URL_SUPPORT } from '../../../../shared/http/constants/urls';
import { Quotation } from '../../../../shared/models';
import { Customer } from '../../../../shared/models/customer';
import { SapCallInProgress } from '../../../../shared/models/quotation';
import {
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '../../../../shared/models/quotation-detail';
import { CustomerService } from '../../../../shared/services/rest/customer/customer.service';
import { MaterialService } from '../../../../shared/services/rest/material/material.service';
import { QuotationService } from '../../../../shared/services/rest/quotation/quotation.service';
import { QuotationDetailsService } from '../../../../shared/services/rest/quotation-details/quotation-details.service';
import {
  addMaterialRowDataItems,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  confirmSimulatedQuotation,
  createSapQuote,
  createSapQuoteFailure,
  createSapQuoteSuccess,
  loadAvailableCurrenciesFailure,
  loadAvailableCurrenciesSuccess,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationFromUrl,
  loadQuotationInInterval,
  loadQuotationSuccess,
  loadQuotationSuccessFullyCompleted,
  loadSelectedQuotationDetailFromUrl,
  refreshSapPricing,
  refreshSapPricingFailure,
  refreshSapPricingSuccess,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  resetSimulatedQuotation,
  selectQuotation,
  setSelectedQuotationDetail,
  updateMaterialRowDataItem,
  updateQuotation,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  updateQuotationFailure,
  updateQuotationSuccess,
  uploadSelectionToSap,
  uploadSelectionToSapFailure,
  uploadSelectionToSapSuccess,
  validateAddMaterialsOnCustomerAndSalesOrg,
  validateAddMaterialsOnCustomerAndSalesOrgFailure,
  validateAddMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import {
  AddQuotationDetailsRequest,
  QuotationIdentifier,
  UpdateQuotationDetail,
} from '../../reducers/models';
import {
  getAddMaterialRowData,
  getAddQuotationDetailsRequest,
  getAvailableCurrencies,
  getCustomer,
  getGqId,
  getRemoveQuotationDetailsRequest,
  getSelectedQuotationIdentifier,
  getSimulatedQuotation,
} from '../../selectors';
import {
  addCalculationsForDetails,
  checkEqualityOfIdentifier,
  mapQueryParamsToIdentifier,
} from './process-case.utils';

@Injectable()
export class ProcessCaseEffect {
  customerDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCustomer),
      concatLatestFrom(() => this.store.select(getSelectedQuotationIdentifier)),
      map(([_action, quotationIdentifier]) => quotationIdentifier),
      mergeMap((quotationIdentifier: QuotationIdentifier) =>
        this.customerService.getCustomer(quotationIdentifier).pipe(
          map((item: Customer) =>
            loadCustomerSuccess({
              item,
            })
          ),
          catchError((errorMessage) =>
            of(loadCustomerFailure({ errorMessage }))
          )
        )
      )
    );
  });

  quotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadQuotation),
      concatLatestFrom(() => this.store.select(getSelectedQuotationIdentifier)),
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
            if (item.calculationInProgress || item.sapCallInProgress) {
              return [loadQuotationSuccess({ item })];
            }

            return [
              loadQuotationSuccess({ item }),
              loadQuotationSuccessFullyCompleted(),
            ];
          }),
          catchError((errorMessage) =>
            of(loadQuotationFailure({ errorMessage }))
          )
        )
      )
    );
  });

  quotationInterval$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadQuotationInInterval),
      mergeMap(() =>
        timer(0, 60_000).pipe(
          mergeMap(() => from([{ type: loadQuotation.type }])),
          takeUntil(
            this.actions$.pipe(ofType(loadQuotationSuccessFullyCompleted))
          )
        )
      )
    );
  });
  triggerDataLoad$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(selectQuotation),
      mergeMap(() => {
        return [loadQuotationInInterval(), loadCustomer()];
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
            loadSelectedQuotationDetailFromUrl({
              gqPositionId: routerState.queryParams['gqPositionId'],
            }),
            loadQuotationFromUrl({ queryParams: routerState.queryParams }),
          ];
        }

        return [loadQuotationFromUrl({ queryParams: routerState.queryParams })];
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
        return [resetSimulatedQuotation()];
      })
    );
  });

  loadSelectedQuotationDetailFromUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSelectedQuotationDetailFromUrl),
      map((action: any) => action.gqPositionId),
      filter((gqPositionId: string) => {
        if (!gqPositionId) {
          this.router.navigate(['not-found']);
        }

        return gqPositionId !== undefined;
      }),
      map((gqPositionId: string) =>
        setSelectedQuotationDetail({
          gqPositionId,
        })
      )
    );
  });

  loadQuotationFromUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadQuotationFromUrl),
      map((action: any) => action.queryParams),
      map((queryParams) => mapQueryParamsToIdentifier(queryParams)),
      filter((quotationIdentifier: QuotationIdentifier) => {
        if (quotationIdentifier === undefined) {
          this.router.navigate(['not-found']);
        }

        return quotationIdentifier !== undefined;
      }),
      concatLatestFrom(() => this.store.select(getSelectedQuotationIdentifier)),
      filter(
        ([identifierFromRoute, identifierCurrent]) =>
          !checkEqualityOfIdentifier(identifierFromRoute, identifierCurrent)
      ),
      map(([identifierFromRoute, _identifierCurrent]) => identifierFromRoute),
      map((quotationIdentifier: QuotationIdentifier) =>
        selectQuotation({ quotationIdentifier })
      )
    );
  });

  validateAfterItemAdded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addMaterialRowDataItems.type),
      map(() => validateAddMaterialsOnCustomerAndSalesOrg())
    );
  });

  validateAfterItemUpdated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateMaterialRowDataItem.type),
      map(() => validateAddMaterialsOnCustomerAndSalesOrg())
    );
  });

  /**
   * Get Validation for materialNumbers in combination with Customer and SalesOrg
   */
  validateMaterialsOnCustomerAndSalesOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(validateAddMaterialsOnCustomerAndSalesOrg.type),
      concatLatestFrom(() => [
        this.store.select(getAddMaterialRowData),
        this.store.select(getCustomer),
      ]),
      mergeMap(
        ([_action, tableData, customer]: [
          ReturnType<typeof validateAddMaterialsOnCustomerAndSalesOrg>,
          MaterialTableItem[],
          Customer
        ]) => {
          const request: MaterialValidationRequest = {
            customerId: customer.identifier,
            materialNumbers: [
              ...new Set(tableData.map((el) => el.materialNumber)),
            ],
          };

          return this.materialService.validateMaterials(request).pipe(
            map((response: MaterialValidationResponse) =>
              validateAddMaterialsOnCustomerAndSalesOrgSuccess({
                materialValidations: response?.validatedMaterials,
              })
            ),
            catchError((errorMessage) =>
              of(
                validateAddMaterialsOnCustomerAndSalesOrgFailure({
                  errorMessage,
                })
              )
            )
          );
        }
      )
    );
  });

  addMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addMaterials.type),
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
              addMaterialsSuccess({ updatedQuotation })
            ),
            catchError((errorMessage) =>
              of(addMaterialsFailure({ errorMessage }))
            )
          )
      )
    );
  });

  removePositions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(removePositions.type),
      concatLatestFrom(() =>
        this.store.select(getRemoveQuotationDetailsRequest)
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
            removePositionsSuccess({ updatedQuotation })
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

            let messageText = '';
            if (errorCodes?.length > 0) {
              messageText = `shared.sapStatusLabels.errorCodes.${errorCodes[0]}`;
            } else if (errorMessage.status === 400) {
              messageText = 'errorInterceptorActionForbidden';
            } else {
              messageText = 'errorInterceptorMessageDefault';
            }

            this.snackBar
              .open(
                translate(messageText),
                translate('errorInterceptorActionDefault'),
                {
                  duration: 5000,
                }
              )
              .onAction()
              .subscribe(() => window.open(URL_SUPPORT, '_blank').focus());

            return of(
              removePositionsFailure({
                errorMessage: errorMessage.message,
                updatedQuotation: errorMessage.error,
              })
            );
          })
        )
      )
    );
  });

  updateMaterials$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateQuotationDetails.type),
      map((action: any) => action.updateQuotationDetailList),
      mergeMap((updateQuotationDetailList: UpdateQuotationDetail[]) =>
        this.quotationDetailsService
          .updateQuotationDetail(updateQuotationDetailList)
          .pipe(
            tap(() =>
              this.showUpdateQuotationDetailToast(updateQuotationDetailList[0])
            ),
            tap((quotation) => {
              addCalculationsForDetails(quotation.quotationDetails);
            }),
            map((updatedQuotation) =>
              updateQuotationDetailsSuccess({
                updatedQuotation,
              })
            ),
            catchError((errorMessage) =>
              of(updateQuotationDetailsFailure({ errorMessage }))
            )
          )
      )
    );
  });

  uploadSelectionToSap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(uploadSelectionToSap),
      map((action) => action.gqPositionIds),
      mergeMap((gqPositionIds: string[]) =>
        this.quotationService.uploadSelectionToSap(gqPositionIds).pipe(
          tap((quotation) => {
            this.showUploadSelectionToast(quotation, gqPositionIds);
          }),
          tap((quotation) => {
            addCalculationsForDetails(quotation.quotationDetails);
          }),
          map((updatedQuotation: Quotation) =>
            uploadSelectionToSapSuccess({ updatedQuotation })
          ),
          catchError((errorMessage) =>
            of(uploadSelectionToSapFailure({ errorMessage }))
          )
        )
      )
    );
  });

  refreshSapPricing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(refreshSapPricing),
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
                refreshSapPricingSuccess({ quotation }),
                loadQuotationInInterval(),
              ];
            }

            return [refreshSapPricingSuccess({ quotation })];
          }),
          catchError((errorMessage) =>
            of(refreshSapPricingFailure({ errorMessage }))
          )
        )
      )
    );
  });

  updateQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateQuotation),
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
            },
            gqId
          )
          .pipe(
            tap((item) => addCalculationsForDetails(item.quotationDetails)),
            map((quotation: Quotation) =>
              updateQuotationSuccess({ quotation })
            ),
            catchError((errorMessage) =>
              of(updateQuotationFailure({ errorMessage }))
            )
          )
      )
    );
  });

  confirmSimulatedQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(confirmSimulatedQuotation),
      concatLatestFrom(() => this.store.select(getSimulatedQuotation)),
      map(([_action, simulatedQuotation]) => simulatedQuotation),
      mergeMap((simulatedQuotation) => {
        const updateQuotationDetailList: UpdateQuotationDetail[] =
          simulatedQuotation.quotationDetails.map((detail) => ({
            gqPositionId: detail.gqPositionId,
            price: detail.price,
            priceSource: detail.priceSource,
          }));

        return [
          updateQuotationDetails({ updateQuotationDetailList }),
          resetSimulatedQuotation(),
        ];
      })
    );
  });

  loadAvailableCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      concatLatestFrom(() => this.store.select(getAvailableCurrencies)),
      filter(
        ([routerState, availableCurrencies]) =>
          routerState.url.includes(AppRoutePath.ProcessCaseViewPath) &&
          availableCurrencies?.length === 0
      ),
      mergeMap(() =>
        this.quotationService.getCurrencies().pipe(
          map((currencies: { currency: string }[]) => {
            const currencyNames = currencies.map(
              (currency: { currency: string }) => currency.currency
            );

            return loadAvailableCurrenciesSuccess({
              currencies: currencyNames.sort((a, b) => a.localeCompare(b)),
            });
          }),
          catchError((errorMessage) => {
            return of(loadAvailableCurrenciesFailure(errorMessage));
          })
        )
      )
    );
  });

  createSapQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createSapQuote),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(([action, gqId]: [ReturnType<typeof createSapQuote>, number]) =>
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
                  createSapQuoteSuccess({ quotation }),
                  loadQuotationInInterval(),
                ];
              }

              return [createSapQuoteSuccess({ quotation })];
            }),
            catchError((errorMessage) =>
              of(createSapQuoteFailure({ errorMessage }))
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
    private readonly store: Store,
    private readonly router: Router,
    private readonly materialService: MaterialService,
    private readonly snackBar: MatSnackBar
  ) {}

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

  private showUpdateQuotationDetailToast(update: UpdateQuotationDetail): void {
    let translateString = `shared.snackBarMessages.`;
    if (update.price) {
      translateString += 'updateSelectedPrice';
    } else if (update.orderQuantity) {
      translateString += 'updateQuantity';
    } else {
      translateString += 'updateComment';
    }
    this.snackBar.open(translate(translateString));
  }
}
