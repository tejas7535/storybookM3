import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { CurrencyActions } from './currency.actions';
import { currencyFeature } from './currency.reducer';

@Injectable({
  providedIn: 'root',
})
export class CurrencyFacade {
  constructor(private readonly store: Store) {}

  availableCurrencies$: Observable<string[]> = this.store.select(
    currencyFeature.selectAvailableCurrencies
  );

  loadCurrencies(): void {
    this.store.dispatch(CurrencyActions.loadAvailableCurrencies());
  }
}
