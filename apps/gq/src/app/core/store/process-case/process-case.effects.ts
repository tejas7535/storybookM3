import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { Customer } from '@gq/shared/models/customer';
import { MaterialTableItem } from '@gq/shared/models/table';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  MaterialValidationRequest,
  MaterialValidationResponse,
} from '@gq/shared/services/rest/material/models';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { CurrencyFacade } from '../currency/currency.facade';
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
          Customer,
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

  loadAvailableCurrencies$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        concatLatestFrom(() => this.currencyFacade.availableCurrencies$),
        map(([action, currencies]: [RouterNavigatedAction, string[]]) => {
          if (
            action.payload.routerState.url.includes(
              AppRoutePath.ProcessCaseViewPath
            ) &&
            currencies?.length === 0
          ) {
            this.currencyFacade.loadCurrencies();
          }
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly materialService: MaterialService,
    private readonly currencyFacade: CurrencyFacade
  ) {}
}
