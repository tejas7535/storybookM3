import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { SnackBarService } from '@schaeffler/snackbar';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { CustomerDetailsService } from '../../../../process-case-view/service/customer-details.service';
import { QuotationDetailsService } from '../../../../process-case-view/service/quotation-details.service';
import { ValidationService } from '../../../../shared/services/validationService/validation.service';
import {
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  pasteRowDataItemsToAddMaterial,
  removeMaterials,
  removeMaterialsFailure,
  removeMaterialsSuccess,
  selectQuotation,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  AddQuotationDetailsRequest,
  Customer,
  MaterialTableItem,
  MaterialValidation,
  Quotation,
  QuotationIdentifier,
} from '../../models';
import * as fromRouter from '../../reducers';
import {
  getAddMaterialRowData,
  getAddQuotationDetailsRequest,
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
        this.customerDetailsService
          .getCustomer(quotationIdentifier.customerNumber)
          .pipe(
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
        this.quotationDetailsService
          .getQuotation(quotationIdentifier.quotationNumber)
          .pipe(
            map((item: Quotation) => ProcessCaseEffect.addRandomValues(item)),
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

  selectQuotation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState) =>
          routerState.url.indexOf(AppRoutePath.ProcessCaseViewPath) >= 0 ||
          routerState.url.indexOf(AppRoutePath.CustomerViewPath) >= 0 ||
          routerState.url.indexOf(AppRoutePath.DetailViewPath) >= 0
      ),
      map((routerState) =>
        ProcessCaseEffect.mapQueryParamsToIdentifier(routerState.queryParams)
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
      map((quotationIdentifier: QuotationIdentifier) => {
        return selectQuotation({ quotationIdentifier });
      })
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
        this.validationService.validate(tableData).pipe(
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
            map((item) => {
              const successMessage = translate(
                'processCaseView.snackBarMessages.materialAdded'
              );
              this.snackBarService.showSuccessMessage(successMessage);

              return addMaterialsSuccess({ item });
            }),
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
          map((item) => {
            const successMessage = translate(
              'processCaseView.snackBarMessages.materialDeleted'
            );
            this.snackBarService.showSuccessMessage(successMessage);

            return removeMaterialsSuccess({ item });
          }),
          catchError((errorMessage) =>
            of(removeMaterialsFailure({ errorMessage }))
          )
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly customerDetailsService: CustomerDetailsService,
    private readonly quotationDetailsService: QuotationDetailsService,
    private readonly store: Store<fromRouter.AppState>,
    private readonly router: Router,
    private readonly validationService: ValidationService,
    private readonly snackBarService: SnackBarService
  ) {}

  private static mapQueryParamsToIdentifier(
    queryParams: any
  ): { quotationNumber: string; customerNumber: string } {
    const quotationNumber: string = queryParams['quotation_number'];
    const customerNumber: string = queryParams['customer_number'];

    return quotationNumber || customerNumber
      ? { quotationNumber, customerNumber }
      : undefined;
  }

  private static checkEqualityOfIdentifier(
    fromRoute: QuotationIdentifier,
    current: QuotationIdentifier
  ): boolean {
    return (
      fromRoute.customerNumber === current?.customerNumber &&
      fromRoute.quotationNumber === current?.quotationNumber
    );
  }

  private static addRandomValues(item: Quotation): any {
    item.quotationDetails.forEach((value) => {
      value.rsp = (Math.random() * 10).toFixed(2);
      value.margin = `${(Math.random() * 100).toFixed(2).toString()} %`;
      value.netValue = (value.orderQuantity * Number(value.rsp))
        .toFixed(2)
        .toString();
      const arr = ['PAT', 'SAP System', 'Custom'];
      value.priceSource = arr[Math.floor(Math.random() * 3)];
    });

    return loadQuotationSuccess({
      item,
    });
  }
}
