import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { getGqId } from '@gq/core/store/active-case/active-case.selectors';
import { ExtendedComparableLinkedTransactionsActions } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { ExtendedComparableLinkedTransaction } from '@gq/core/store/extended-comparable-linked-transactions/models';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class ExtendedComparableLinkedTransactionsEffect {
  loadExtendedComparableLinkedTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail
      ),
      concatLatestFrom(() => this.store.select(getGqId)),
      map(([_action, gqId]) => gqId),
      mergeMap((quotationNumber: number) =>
        this.quotationDetailsService.getAllTransactions(quotationNumber).pipe(
          map(
            (
              extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[]
            ) =>
              ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForQuotationDetailSuccess(
                {
                  extendedComparableLinkedTransactions,
                }
              )
          ),
          catchError((errorMessage) =>
            of(
              ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForQuotationDetailFailure(
                { errorMessage }
              )
            )
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
