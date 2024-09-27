import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TransactionsEffect } from './transactions.effects';
import { TransactionsFacade } from './transactions.facade';
import { transactionsFeature } from './transactions.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(transactionsFeature),
    EffectsModule.forFeature([TransactionsEffect]),
  ],
  providers: [TransactionsFacade],
})
export class TransactionsModule {}
