import { Injectable } from '@angular/core';

import { Currency } from '@cdba/shared/constants/currency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  public getCurrency(): `${Currency}` {
    return 'EUR';
  }
}
