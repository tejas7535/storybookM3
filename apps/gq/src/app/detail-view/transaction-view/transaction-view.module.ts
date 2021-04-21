import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { TransactionViewRoutingModule } from './transaction-view-routing.module';
import { TransactionViewComponent } from './transaction-view.component';

@NgModule({
  declarations: [TransactionViewComponent],
  imports: [
    CommonModule,
    TransactionViewRoutingModule,
    UnderConstructionModule,
  ],
})
export class TransactionViewModule {}
