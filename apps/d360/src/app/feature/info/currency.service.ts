import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

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

  constructor(private readonly http: HttpClient) {
    this.fetchAvailableCurrencies();
    this.checkStoredCurrency();
  }

  getCurrentCurrency() {
    return this.currentCurrency.asObservable();
  }

  getAvailableCurrencies() {
    return this.availableCurrencies.asObservable();
  }

  setCurrentCurrency(currency: string) {
    if (this.availableCurrencies.getValue().includes(currency)) {
      this.currentCurrency.next(currency);
      localStorage.setItem('currency', currency);
    } else {
      throw new Error('Saving currency failed.');
    }
  }

  private fetchAvailableCurrencies() {
    this.http.get<string[]>(this.CURRENT_CURRENCY_API).subscribe({
      next: (data) => this.availableCurrencies.next(data),
      error: () => this.availableCurrencies.next([this.DEFAULT_CURRENCY]),
    });
  }

  private checkStoredCurrency() {
    const storedCurrency = localStorage.getItem('currency');
    if (
      storedCurrency &&
      this.availableCurrencies.getValue().includes(storedCurrency)
    ) {
      this.currentCurrency.next(storedCurrency);
    } else {
      this.currentCurrency.next(this.DEFAULT_CURRENCY);
    }
  }
}
