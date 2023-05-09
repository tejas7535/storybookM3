import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { PriceUnitForQuotationItemId } from '@gq/shared/models/quotation-detail/price-units-for-quotation-item-ids.model';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { multiplyAndRoundValues } from '@gq/shared/utils/pricing.utils';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from '../../actions';
import {
  getGqId,
  getPriceUnitsForQuotationItemIds,
} from '../../active-case/active-case.selectors';
import { ExtendedComparableLinkedTransaction } from '../../reducers/models';

@Injectable()
export class ExtendedComparableLinkedTransactionsEffect {
  loadExtendedComparableLinkedTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadExtendedComparableLinkedTransaction.type),
      concatLatestFrom(() => this.store.select(getGqId)),
      map(([_action, gqId]) => gqId),
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
              this.multiplyExtendedComparableLinkedTransactionsWithPriceUnit(
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

  private readonly multiplyExtendedComparableLinkedTransactionsWithPriceUnit = (
    transactions: ExtendedComparableLinkedTransaction[],
    priceUnitsForQuotationItemIds: PriceUnitForQuotationItemId[]
  ): ExtendedComparableLinkedTransaction[] =>
    transactions.map((transaction) => ({
      ...transaction,
      price: multiplyAndRoundValues(
        transaction.price,
        priceUnitsForQuotationItemIds.find(
          (priceUnitsForQuotationItemId: PriceUnitForQuotationItemId) =>
            transaction.itemId === priceUnitsForQuotationItemId.quotationItemId
        ).priceUnit
      ),
    }));
}
