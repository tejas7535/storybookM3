import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { Customer } from '@gq/shared/models/customer';
import { MaterialTableItem } from '@gq/shared/models/table';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  MaterialValidationRequest,
  MaterialValidationResponse,
} from '@gq/shared/services/rest/material/models';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import {
  loadAvailableCurrenciesFailure,
  loadAvailableCurrenciesSuccess,
} from '../actions';
import { activeCaseFeature } from '../active-case';
import { getAvailableCurrencies } from '../selectors';
import { ProcessCaseActions } from './process-case.action';
import { getAddMaterialRowData } from './process-case.selectors';

@Injectable()
export class ProcessCaseEffects {
  validateAfterItemAdded$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProcessCaseActions.addNewItemsToMaterialTable),
      map(() => ProcessCaseActions.validateMaterialTableItems())
    );
  });

  /**
   * Get Validation for materialNumbers in combination with Customer and SalesOrg
   */
  validateMaterialsOnCustomerAndSalesOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProcessCaseActions.validateMaterialTableItems),
      concatLatestFrom(() => [
        this.store.select(getAddMaterialRowData),
        this.store.select(activeCaseFeature.selectCustomer),
      ]),
      mergeMap(
        ([_action, tableData, customer]: [
          ReturnType<typeof ProcessCaseActions.validateMaterialTableItems>,
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
              ProcessCaseActions.validateMaterialTableItemsSuccess({
                materialValidations: response?.validatedMaterials,
              })
            ),
            catchError((errorMessage) =>
              of(
                ProcessCaseActions.validateMaterialTableItemsFailure({
                  errorMessage,
                })
              )
            )
          );
        }
      )
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

  constructor(
    private readonly actions$: Actions,
    private readonly quotationService: QuotationService,
    private readonly store: Store,
    private readonly materialService: MaterialService
  ) {}
}
