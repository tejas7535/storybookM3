import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { SharedModule } from '../../shared';
import { CaseHeaderModule } from '../../shared/header/case-header/case-header.module';
import { ComparableTransactionsModule } from './comparable-transactions/comparable-transactions.module';
import { TransactionViewHeaderContentModule } from './transaction-view-header-content/transaction-view-header-content.module';
import { TransactionViewRoutingModule } from './transaction-view-routing.module';
import { TransactionViewComponent } from './transaction-view.component';
import { TransparencyGraphModule } from './transparency-graph/transparency-graph.module';

@NgModule({
  declarations: [TransactionViewComponent],
  imports: [
    TransactionViewRoutingModule,
    CaseHeaderModule,
    ComparableTransactionsModule,
    TransparencyGraphModule,
    MatCardModule,
    SharedModule,
    ReactiveComponentModule,
    LoadingSpinnerModule,
    TransactionViewHeaderContentModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'transaction-view',
    },
  ],
})
export class TransactionViewModule {}
