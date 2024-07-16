import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  ExtendedSapPriceConditionDetail,
  SapPriceConditionDetail,
} from '../reducers/models';
import {
  getExtendedSapPriceConditionDetails,
  getSapPriceDetails,
  getSapPriceDetailsLoading,
} from '../selectors/sap-price-details/sap-price-details.selector';

@Injectable({
  providedIn: 'root',
})
export class SapPriceDetailsFacade {
  private readonly store: Store = inject(Store);

  sapPriceDetails$: Observable<SapPriceConditionDetail[]> =
    this.store.select(getSapPriceDetails);

  sapPriceDetailsLoading$: Observable<boolean> = this.store.select(
    getSapPriceDetailsLoading
  );

  extendedSapPriceConditionDetails$: Observable<
    ExtendedSapPriceConditionDetail[]
  > = this.store.select(getExtendedSapPriceConditionDetails);
}
