import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { ComparableTransactionsComponent } from './comparable-transactions.component';

@NgModule({
  declarations: [ComparableTransactionsComponent],
  imports: [CommonModule, UnderConstructionModule],
  exports: [ComparableTransactionsComponent],
})
export class ComparableTransactionsModule {}
