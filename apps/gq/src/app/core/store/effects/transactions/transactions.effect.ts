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
import { select, Store } from '@ngrx/store';
import { PriceService } from '../../../../shared/services/price-service/price.service';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { Transaction } from '../../../../core/store/reducers/transactions/models/transaction.model';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../../actions';
import { AppState, RouterStateUrl } from '../../reducers';
import { getPriceUnitOfSelectedQuotationDetail } from '../../selectors';

@Injectable()
export class TransactionsEffect {
  /**
   * trigger loadTransactions for quotationDetail
   */
  triggerLoadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState: RouterStateUrl) =>
          routerState.url.indexOf(
            `${AppRoutePath.DetailViewPath}/${DetailRoutePath.TransactionsPath}`
          ) >= 0
      ),
      map((routerState) =>
        loadComparableTransactions({
          gqPositionId: routerState.queryParams['gqPositionId'],
        })
      )
    )
  );
  /**
   * loadTransactions for quotationDetail
   */
  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComparableTransactions.type),
      map((action: any) => action.gqPositionId),
      mergeMap((gqPositionId: string) =>
        this.quotationDetailsService.getTransactions(gqPositionId).pipe(
          withLatestFrom(
            this.store.pipe(select(getPriceUnitOfSelectedQuotationDetail))
          ),
          map(([transactions, priceUnit]: [Transaction[], number]) => ({
            transactions,
            priceUnit,
          })),
          map((object: { transactions: Transaction[]; priceUnit: number }) =>
            PriceService.multiplyTransactionsWithPriceUnit(
              object.transactions,
              object.priceUnit
            )
          ),
          map((transactions: Transaction[]) =>
            loadComparableTransactionsSuccess({ transactions })
          ),
          catchError((errorMessage) =>
            of(loadComparableTransactionsFailure({ errorMessage }))
          )
        )
      )
    )
  );

  constructor(
    private readonly store: Store<AppState>,
    private readonly actions$: Actions,
    private readonly quotationDetailsService: QuotationDetailsService
  ) {}
}
