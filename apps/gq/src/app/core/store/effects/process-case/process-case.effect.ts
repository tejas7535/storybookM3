import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import { AppRoutePath } from '../../../../app-route-path.enum';
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
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationFromUrl,
  loadQuotationSuccess,
  loadSelectedQuotationDetailFromUrl,
  pasteRowDataItemsToAddMaterial,
  removeMaterials,
  removeMaterialsFailure,
  removeMaterialsSuccess,
  selectQuotation,
  setSelectedQuotationDetail,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  uploadOfferToSap,
  uploadOfferToSapFailure,
  uploadOfferToSapSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import * as fromRouter from '../../reducers';
import {
  AddQuotationDetailsRequest,
  QuotationIdentifier,
  UpdateQuotationDetail,
} from '../../reducers/process-case/models';
import {
  getAddMaterialRowData,
  getAddQuotationDetailsRequest,
  getGqId,
  getRemoveQuotationDetailsRequest,
  getSelectedQuotationIdentifier,
} from '../../selectors';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class ProcessCaseEffect {
  /**
   * Get possible values for a form field
   *
   */
  customerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomer),
      withLatestFrom(this.store.pipe(select(getSelectedQuotationIdentifier))),
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
    )
  );

  /**
   * Get possible values for a form field
   *
   */
  quotationDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotation),
      withLatestFrom(this.store.pipe(select(getSelectedQuotationIdentifier))),
      map(([_action, quotationIdentifier]) => quotationIdentifier),
      mergeMap((quotationIdentifier: QuotationIdentifier) =>
        this.quotationService.getQuotation(quotationIdentifier.gqId).pipe(
          tap((item) =>
            PriceService.addCalculationsForDetails(item.quotationDetails)
          ),
          map((item: Quotation) =>
            loadQuotationSuccess({
              item,
            })
          ),
          catchError((errorMessage) =>
            of(loadQuotationFailure({ errorMessage }))
          )
        )
      )
    )
  );

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectQuotation),
      mergeMap(() => {
        return [loadQuotation(), loadCustomer()];
      })
    )
  );

  loadFromUrl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) =>
          routerState.url.indexOf(AppRoutePath.ProcessCaseViewPath) >= 0 ||
          routerState.url.indexOf(AppRoutePath.CustomerViewPath) >= 0 ||
          routerState.url.indexOf(AppRoutePath.DetailViewPath) >= 0 ||
          routerState.url.indexOf(AppRoutePath.OfferViewPath) >= 0
      ),
      mergeMap((routerState) => {
        if (routerState.url.indexOf(AppRoutePath.DetailViewPath) >= 0) {
          return [
            loadSelectedQuotationDetailFromUrl({
              gqPositionId: routerState.queryParams['gqPositionId'],
            }),
            loadQuotationFromUrl({ queryParams: routerState.queryParams }),
          ];
        }

        return [loadQuotationFromUrl({ queryParams: routerState.queryParams })];
      })
    )
  );

  loadSelectedQuotationDetailFromUrl$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  loadQuotationFromUrl$ = createEffect(() =>
    this.actions$.pipe(
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
      withLatestFrom(this.store.pipe(select(getSelectedQuotationIdentifier))),
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
    )
  );

  /**
   * Get Validation for materialNumbers
   */
  validate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pasteRowDataItemsToAddMaterial.type),
      withLatestFrom(this.store.pipe(select(getAddMaterialRowData))),
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
    )
  );

  addMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addMaterials.type),
      withLatestFrom(this.store.pipe(select(getAddQuotationDetailsRequest))),
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
              this.snackBarService.showSuccessMessage(successMessage);
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
    )
  );

  removeMaterials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeMaterials.type),
      withLatestFrom(this.store.pipe(select(getRemoveQuotationDetailsRequest))),
      map(([_action, qgPositionIds]) => qgPositionIds),
      mergeMap((qgPositionIds: string[]) =>
        this.quotationDetailsService.removeMaterial(qgPositionIds).pipe(
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.materialDeleted'
            );
            this.snackBarService.showSuccessMessage(successMessage);
          }),
          tap((item) =>
            PriceService.addCalculationsForDetails(item.quotationDetails)
          ),
          map((item) => removeMaterialsSuccess({ item })),
          catchError((errorMessage) =>
            of(removeMaterialsFailure({ errorMessage }))
          )
        )
      )
    )
  );

  updateMaterials$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  uploadToSap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadOfferToSap.type),
      withLatestFrom(this.store.pipe(select(getGqId))),
      map(([_action, gqId]) => gqId),

      mergeMap((gqId: number) =>
        this.quotationService.uploadOfferToSap(gqId).pipe(
          tap(() => {
            const successMessage = translate(
              'shared.snackBarMessages.uploadOfferSuccess'
            );
            this.snackBarService.showSuccessMessage(successMessage);
          }),
          map(uploadOfferToSapSuccess),
          catchError((errorMessage) =>
            of(uploadOfferToSapFailure({ errorMessage }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly quotationDetailsService: QuotationDetailsService,
    private readonly quotationService: QuotationService,
    private readonly store: Store<fromRouter.AppState>,
    private readonly router: Router,
    private readonly materialService: MaterialService,
    private readonly snackBarService: SnackBarService
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
      translateString += 'updateSelectedOffers';
    }
    this.snackBarService.showSuccessMessage(translate(translateString));
  }
}
