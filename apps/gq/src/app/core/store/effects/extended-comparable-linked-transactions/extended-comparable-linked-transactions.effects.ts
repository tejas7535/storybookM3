import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { getGqId } from '@gq/core/store/active-case/active-case.selectors';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from '../../actions';
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
