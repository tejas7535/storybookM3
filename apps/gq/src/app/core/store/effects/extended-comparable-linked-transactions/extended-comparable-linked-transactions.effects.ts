import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { PriceUnitForQuotationItemId } from '../../../../shared/models/quotation-detail/price-units-for-quotation-item-ids.model';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from '../../actions/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { ExtendedComparableLinkedTransaction } from '../../reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import { getPriceUnitsForQuotationItemIds } from '../../selectors';

@Injectable()
export class ExtendedComparableLinkedTransactionsEffect {
  loadExtendedComparableLinkedTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadExtendedComparableLinkedTransaction.type),
      map((action: any) => action.quotationNumber),
      mergeMap((quotationNumber: number) =>
        this.quotationDetailsService.getAllTransactions(quotationNumber).pipe(
          withLatestFrom(this.store.select(getPriceUnitsForQuotationItemIds)),
          map(
            ([transactions, priceUnitsForQuotationItemIds]: [
              ExtendedComparableLinkedTransaction[],
              PriceUnitForQuotationItemId[]
            ]) => ({
              transactions,
              priceUnitsForQuotationItemIds,
            })
          ),
          map(
            (object: {
              transactions: ExtendedComparableLinkedTransaction[];
              priceUnitsForQuotationItemIds: PriceUnitForQuotationItemId[];
            }) =>
              PriceService.multiplyExtendedComparableLinkedTransactionsWithPriceUnit(
                object.transactions,
                object.priceUnitsForQuotationItemIds
              )
          ),
          map(
            (
              extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[]
            ) =>
              loadExtendedComparableLinkedTransactionSuccess({
                extendedComparableLinkedTransactions,
              })
          ),
          catchError((errorMessage) =>
            of(loadExtendedComparableLinkedTransactionFailure({ errorMessage }))
          )
        )
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly quotationDetailsService: QuotationDetailsService
  ) {}
}
