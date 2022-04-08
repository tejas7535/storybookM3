import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';

import { CustomerHeaderModule } from '../../shared/components/header/customer-header/customer-header.module';
import { MaterialPriceHeaderContentModule } from '../../shared/components/header/material-price-header-content/material-price-header-content.module';
import { ComparableTransactionsModule } from './comparable-transactions/comparable-transactions.module';
import { SavingInProgressComponent } from './saving-in-progress/saving-in-progress.component';
import { TransactionViewComponent } from './transaction-view.component';
import { TransactionViewRoutingModule } from './transaction-view-routing.module';
import { TransparencyGraphModule } from './transparency-graph/transparency-graph.module';

@NgModule({
  declarations: [TransactionViewComponent, SavingInProgressComponent],
  imports: [
    TranslocoModule,
    TransactionViewRoutingModule,
    ComparableTransactionsModule,
    TransparencyGraphModule,
    MatCardModule,
    ReactiveComponentModule,
    LoadingSpinnerModule,
    MaterialPriceHeaderContentModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
    CommonModule,
    CustomerHeaderModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'transaction-view',
    },
  ],
})
export class TransactionViewModule {}
