import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';

import { SharedModule } from '../../shared';
import { ShareButtonModule } from '../../shared/header/share-button/share-button.module';
import { ComparableTransactionsModule } from './comparable-transactions/comparable-transactions.module';
import { SavingInProgressComponent } from './saving-in-progress/saving-in-progress.component';
import { TransactionViewHeaderContentModule } from './transaction-view-header-content/transaction-view-header-content.module';
import { TransactionViewRoutingModule } from './transaction-view-routing.module';
import { TransactionViewComponent } from './transaction-view.component';
import { TransparencyGraphModule } from './transparency-graph/transparency-graph.module';

@NgModule({
  declarations: [TransactionViewComponent, SavingInProgressComponent],
  imports: [
    TranslocoModule,
    TransactionViewRoutingModule,
    ComparableTransactionsModule,
    TransparencyGraphModule,
    MatCardModule,
    SharedModule,
    ReactiveComponentModule,
    LoadingSpinnerModule,
    TransactionViewHeaderContentModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'transaction-view',
    },
  ],
})
export class TransactionViewModule {}
