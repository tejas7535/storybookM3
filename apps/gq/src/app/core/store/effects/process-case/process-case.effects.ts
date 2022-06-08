/* eslint-disable max-lines */
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

import { translate } from '@ngneat/transloco';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';
import { Quotation } from '../../../../shared/models';
import { Customer } from '../../../../shared/models/customer';
import { QuotationDetail } from '../../../../shared/models/quotation-detail';
import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../shared/models/table';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import { QuotationService } from '../../../../shared/services/rest-services/quotation-service/quotation.service';
import { SearchService } from '../../../../shared/services/rest-services/search-service/search.service';
import {
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  confirmSimulatedQuotation,
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
  pasteRowDataItemsToAddMaterial,
  refreshSapPricing,
  refreshSapPricingFailure,
  refreshSapPricingSuccess,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  resetSimulatedQuotation,
  selectQuotation,
  setSelectedQuotationDetail,
  updateCaseName,
  updateCaseNameFailure,
  updateCaseNameSuccess,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  uploadSelectionToSap,
  uploadSelectionToSapFailure,
  uploadSelectionToSapSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  AddQuotationDetailsRequest,
  QuotationIdentifier,
  UpdateQuotationDetail,
} from '../../reducers/process-case/models';
import {
  getAddMaterialRowData,
  getAddQuotationDetailsRequest,
  getAvailableCurrencies,
  getGqId,
  getRemoveQuotationDetailsRequest,
  getSelectedQuotationIdentifier,
  getSimulatedQuotation,
} from '../../selectors';

@Injectable()
export class ProcessCaseEffect {
  customerDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCustomer),
      concatLatestFrom(() => this.store.select(getSelectedQuotationIdentifier)),
      map(([_action, quotationIdentifier]) => quotationIdentifier),
      mergeMap((quotationIdentifier: QuotationIdentifier) =>
        this.searchService.getCustomer(quotationIdentifier).pipe(
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
          tap((item) =>
            PriceService.addCalculationsForDetails(item.quotationDetails)
          ),
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
          routerState.url.includes(AppRoutePath.CustomerViewPath) ||
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
      map((queryParams) =>
        ProcessCaseEffect.mapQueryParamsToIdentifier(queryParams)
      ),
      filter((quotationIdentifier: QuotationIdentifier) => {
        if (quotationIdentifier === undefined) {
          this.router.navigate(['not-found']);
        }

        return quotationIdentifier !== undefined;
      }),
      concatLatestFrom(() => this.store.select(getSelectedQuotationIdentifier)),
      filter(
        ([identifierFromRoute, identifierCurrent]) =>
          !ProcessCaseEffect.checkEqualityOfIdentifier(
            identifierFromRoute,
            identifierCurrent
          )
      ),
      map(([identifierFromRoute, _identifierCurrent]) => identifierFromRoute),
      map((quotationIdentifier: QuotationIdentifier) =>
        selectQuotation({ quotationIdentifier })
      )
    );
  });

  /**
   * Get Validation for materialNumbers
   */
  validate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(pasteRowDataItemsToAddMaterial.type),
      concatLatestFrom(() => this.store.select(getAddMaterialRowData)),
      map(([_action, tableData]) => tableData),
      mergeMap((tableData: MaterialTableItem[]) =>
        this.materialService.validateMaterials(tableData).pipe(
          map((materialValidations: MaterialValidation[]) =>
            validateAddMaterialsSuccess({ materialValidations })
          ),
          catchError((errorMessage) =>
            of(validateAddMaterialsFailure({ errorMessage }))
          )
        )
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
          .addMaterial(addQuotationDetailsRequest)
          .pipe(
            tap(() => {
              const successMessage = translate(
                'shared.snackBarMessages.materialAdded'
              );
              this.snackBar.open(successMessage);
            }),
            tap((item) =>
              PriceService.addCalculationsForDetails(item.quotationDetails)
            ),
            map((item) => addMaterialsSuccess({ item })),
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
        this.quotationDetailsService.removeMaterial(qgPositionIds).pipe(
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.materialDeleted'
            );
            this.snackBar.open(successMessage);
          }),
          tap((item) =>
            PriceService.addCalculationsForDetails(item.quotationDetails)
          ),
          map((item) => removePositionsSuccess({ item })),
          catchError((errorMessage) =>
            of(removePositionsFailure({ errorMessage }))
          )
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
          .updateMaterial(updateQuotationDetailList)
          .pipe(
            tap(() =>
              this.showUpdateQuotationDetailToast(updateQuotationDetailList[0])
            ),
            tap((quotationDetails) => {
              PriceService.addCalculationsForDetails(quotationDetails);
            }),
            map((quotationDetails: QuotationDetail[]) =>
              updateQuotationDetailsSuccess({
                quotationDetails,
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
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.uploadSelectionSuccess'
            );
            this.snackBar.open(successMessage);
          }),
          map(uploadSelectionToSapSuccess),
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
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.refreshSapPricingSuccess'
            );
            this.snackBar.open(successMessage);
          }),
          tap((item) =>
            PriceService.addCalculationsForDetails(item.quotationDetails)
          ),
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

  updateCaseName$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateCaseName),
      concatLatestFrom(() => this.store.select(getGqId)),
      mergeMap(([action, gqId]) =>
        this.quotationService.updateCaseName(action.caseName, gqId).pipe(
          map((quotation: ViewQuotation) =>
            updateCaseNameSuccess({ quotation })
          ),
          catchError((errorMessage) =>
            of(updateCaseNameFailure({ errorMessage }))
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
              currencies: currencyNames,
            });
          }),
          catchError((errorMessage) => {
            return of(loadAvailableCurrenciesFailure(errorMessage));
          })
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly quotationDetailsService: QuotationDetailsService,
    private readonly quotationService: QuotationService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly materialService: MaterialService,
    private readonly snackBar: MatSnackBar
  ) {}
  private static mapQueryParamsToIdentifier(queryParams: any): {
    gqId: number;
    customerNumber: string;
    salesOrg: string;
  } {
    const gqId: number = queryParams['quotation_number'];
    const customerNumber: string = queryParams['customer_number'];
    const salesOrg: string = queryParams['sales_org'];

    return gqId && customerNumber && salesOrg
      ? { gqId, customerNumber, salesOrg }
      : undefined;
  }

  private static checkEqualityOfIdentifier(
    fromRoute: QuotationIdentifier,
    current: QuotationIdentifier
  ): boolean {
    return (
      fromRoute.customerNumber === current?.customerNumber &&
      fromRoute.gqId === current?.gqId &&
      fromRoute.salesOrg === current?.salesOrg
    );
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
