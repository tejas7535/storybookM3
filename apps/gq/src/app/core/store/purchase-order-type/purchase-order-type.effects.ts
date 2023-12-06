import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { PurchaseOrderTypeActions } from './purchase-order-type.actions';

@Injectable()
export class PurchaseOrderTypeEffects implements OnInitEffects {
  getAllPurchaseOrderTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PurchaseOrderTypeActions.getAllPurchaseOrderTypes),
      mergeMap((_action) => {
        return this.quotationService.getPurchaseOrderTypes().pipe(
          map((purchaseOrderTypes) =>
            PurchaseOrderTypeActions.getAllPurchaseOrderTypesSuccess({
              purchaseOrderTypes,
            })
          ),
          catchError((errorMessage) =>
            of(
              PurchaseOrderTypeActions.getAllPurchaseOrderTypesFailure({
                errorMessage,
              })
            )
          )
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quotationService: QuotationService
  ) {}
  ngrxOnInitEffects(): Action {
    return PurchaseOrderTypeActions.getAllPurchaseOrderTypes();
  }
}
