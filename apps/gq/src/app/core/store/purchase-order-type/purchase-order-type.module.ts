import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PurchaseOrderTypeEffects } from './purchase-order-type.effects';
import { PurchaseOrderTypeFacade } from './purchase-order-type.facade';
import { purchaseOrderTypeFeature } from './purchase-order-type.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(purchaseOrderTypeFeature),
    EffectsModule.forFeature([PurchaseOrderTypeEffects]),
  ],
  providers: [PurchaseOrderTypeFacade],
})
export class PurchaseOrderTypeModule {}
