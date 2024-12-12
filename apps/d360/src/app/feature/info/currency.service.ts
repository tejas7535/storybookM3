import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BehaviorSubject, catchError, EMPTY, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly CURRENT_CURRENCY_API = 'api/info/currencies';
  private readonly DEFAULT_CURRENCY = 'EUR';
  private readonly currentCurrency = new BehaviorSubject<string>(
    localStorage.getItem('currency') || this.DEFAULT_CURRENCY
  );
  private readonly availableCurrencies = new BehaviorSubject<string[]>([]);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private readonly http: HttpClient) {
    this.fetchAvailableCurrencies();
  }

  public getCurrentCurrency() {
    return this.currentCurrency.asObservable();
  }

  public getAvailableCurrencies() {
    return this.availableCurrencies.asObservable();
  }

  public setCurrentCurrency(currency: string) {
    if (this.currentCurrency.getValue() !== currency) {
      if (this.availableCurrencies.getValue().includes(currency)) {
        localStorage.setItem('currency', currency);
        // This is the future. For now we do full page reload and do not need a reactive currency.
        // Until we implement the general solution for locale and language settings.
        // this.currentCurrency.next(currency);
        location.reload();
      } else {
        throw new Error('Saving currency failed.');
      }
    }
  }

  private fetchAvailableCurrencies() {
    this.http
      .get<string[]>(this.CURRENT_CURRENCY_API)
      .pipe(
        tap((data) => {
          this.availableCurrencies.next(data);
        }),
        catchError(() => {
          this.availableCurrencies.next([this.DEFAULT_CURRENCY]);

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
