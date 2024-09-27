import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { DetailRoutePath } from '@gq/detail-view/detail-route-path.enum';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl } from '../reducers';
import { ComparableLinkedTransactionResponse } from './models/comparable-linked-transaction-response.interface';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from './transactions.actions';

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
          map((res: ComparableLinkedTransactionResponse) =>
            loadComparableTransactionsSuccess({
              comparableLinkedTransactionResponse: res,
            })
          ),
          catchError((errorMessage) =>
            of(loadComparableTransactionsFailure({ errorMessage }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quotationDetailsService: QuotationDetailsService
  ) {}
}
