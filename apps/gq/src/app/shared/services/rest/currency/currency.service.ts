import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  readonly #http = inject(HttpClient);
  readonly PATH_CURRENCIES = 'currencies';

  getCurrencies(): Observable<{ currency: string }[]> {
    return this.#http.get<{ currency: string }[]>(
      `${ApiVersion.V1}/${this.PATH_CURRENCIES}`
    );
  }

  getExchangeRateForCurrency(fromCurrency: string, toCurrency: string) {
    return this.#http.get<{ exchangeRates: { [key: string]: number } }>(
      `${ApiVersion.V1}/${this.PATH_CURRENCIES}/${fromCurrency}/exchangeRates/${toCurrency}`
    );
  }
}
