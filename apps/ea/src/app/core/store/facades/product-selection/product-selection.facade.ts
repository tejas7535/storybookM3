import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getBearingDesignation,
  getBearingId,
  getCalculationModuleInfo,
} from '../../selectors/product-selection/product-selection.selector';

@Injectable({
  providedIn: 'root',
})
export class ProductSelectionFacade {
  public readonly bearingDesignation$ = this.store.select(
    getBearingDesignation
  );
  public bearingId$ = this.store.select(getBearingId);
  public calcualtionModuleInfo$ = this.store.select(getCalculationModuleInfo);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
