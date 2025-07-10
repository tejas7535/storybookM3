import { inject, Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { CurrencyService } from '@gq/shared/services/rest/currency/currency.service';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { CurrencyActions } from './currency.actions';

@Injectable()
export class CurrencyEffects implements OnInitEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly currencyService: CurrencyService = inject(CurrencyService);

  loadCurrencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CurrencyActions.loadAvailableCurrencies),
      mergeMap(() =>
        this.currencyService.getCurrencies().pipe(
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

  ngrxOnInitEffects(): Action {
    return CurrencyActions.loadAvailableCurrencies();
  }
}
