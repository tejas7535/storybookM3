import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { DetailRoutePath } from '@gq/detail-view/detail-route-path.enum';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import {
  multiplyAndRoundValues,
  roundToTwoDecimals,
} from '@gq/shared/utils/pricing.utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../../actions';
import { getPriceUnitOfSelectedQuotationDetail } from '../../active-case/active-case.selectors';
import { RouterStateUrl } from '../../reducers';
import { ComparableLinkedTransaction } from '../../reducers/models';

@Injectable()
export class TransactionsEffect {
  triggerLoadTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.includes(
          `${AppRoutePath.DetailViewPath}/${DetailRoutePath.TransactionsPath}`
        )
      ),
      map((routerState) =>
        loadComparableTransactions({
          gqPositionId: routerState.queryParams['gqPositionId'],
        })
      )
    );
  });

  loadTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadComparableTransactions.type),
      map((action: any) => action.gqPositionId),
      mergeMap((gqPositionId: string) =>
        this.quotationDetailsService.getTransactions(gqPositionId).pipe(
          withLatestFrom(
            this.store.select(getPriceUnitOfSelectedQuotationDetail)
          ),
          map(
            ([transactions, priceUnit]: [
              ComparableLinkedTransaction[],
              number
            ]) => ({
              transactions,
              priceUnit,
            })
          ),
          map(
            (object: {
              transactions: ComparableLinkedTransaction[];
              priceUnit: number;
            }) =>
              this.executeTransactionComputations(
                object.transactions,
                object.priceUnit
              )
          ),
          map((transactions: ComparableLinkedTransaction[]) =>
            loadComparableTransactionsSuccess({ transactions })
          ),
          catchError((errorMessage) =>
            of(loadComparableTransactionsFailure({ errorMessage }))
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

  private readonly executeTransactionComputations = (
    transactions: ComparableLinkedTransaction[],
    priceUnit: number
  ): ComparableLinkedTransaction[] =>
    transactions.map((transaction) => ({
      ...transaction,
      price: multiplyAndRoundValues(transaction.price, priceUnit),
      profitMargin: roundToTwoDecimals(transaction.profitMargin),
    }));
}
