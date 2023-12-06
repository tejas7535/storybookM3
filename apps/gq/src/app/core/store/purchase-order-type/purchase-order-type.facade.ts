import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PurchaseOrderType } from '@gq/shared/models';
import { Store } from '@ngrx/store';

import { selectPurchaseOrderType } from '../actions/create-case/create-case.actions';
import { purchaseOrderTypeFeature } from './purchase-order-type.reducer';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderTypeFacade {
  purchaseOrderTypes$: Observable<PurchaseOrderType[]> = this.store.select(
    purchaseOrderTypeFeature.selectPurchaseOrderTypes
  );

  selectedPurchaseOrderType$: Observable<PurchaseOrderType> = this.store.select(
    purchaseOrderTypeFeature.getSelectedPurchaseOrderType
  );

  constructor(private readonly store: Store) {}

  selectPurchaseOrderTypeForCaseCreation(
    purchaseOrderType: PurchaseOrderType
  ): void {
    this.store.dispatch(selectPurchaseOrderType({ purchaseOrderType }));
  }
}
