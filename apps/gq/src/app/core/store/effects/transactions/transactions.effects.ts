import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../../actions';
import { RouterStateUrl } from '../../reducers';
import { ComparableLinkedTransaction } from '../../reducers/transactions/models/comparable-linked-transaction.model';
import { getPriceUnitOfSelectedQuotationDetail } from '../../selectors';

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
              PriceService.multiplyTransactionsWithPriceUnit(
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
}
