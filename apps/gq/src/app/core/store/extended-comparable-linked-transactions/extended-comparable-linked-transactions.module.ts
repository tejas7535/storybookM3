import { NgModule } from '@angular/core';

import { ExtendedComparableLinkedTransactionsEffect } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.effects';
import { extendedComparableLinkedTransactionsFeature } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    StoreModule.forFeature(extendedComparableLinkedTransactionsFeature),
    EffectsModule.forFeature([ExtendedComparableLinkedTransactionsEffect]),
  ],
})
export class ExtendedComparableLinkedTransactionsModule {}
