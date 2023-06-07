import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { CurrencyActions } from './currency.actions';

@Injectable()
export class CurrencyEffects {
  loadCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.loadAvailableCurrencies),
      mergeMap(() =>
        this.quotationService.getCurrencies().pipe(
          map((currencies: { currency: string }[]) => {
            const currencyNames = currencies.map(
              (currency: { currency: string }) => currency.currency
            );

            return CurrencyActions.loadAvailableCurrenciesSuccess({
              currencies: currencyNames.sort((a, b) => a.localeCompare(b)),
            });
          }),
          catchError((error: Error) =>
            of(CurrencyActions.loadAvailableCurrenciesFailure({ error }))
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quotationService: QuotationService
  ) {}
}
