import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { MaterialPriceHeaderContentModule } from '@gq/shared/components/header/material-price-header-content/material-price-header-content.module';
import { SyncStatusCustomerInfoHeaderModule } from '@gq/shared/components/header/sync-status-customer-info-header/sync-status-customer-info-header.module';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';

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
    PushPipe,
    LoadingSpinnerModule,
    MaterialPriceHeaderContentModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
    CommonModule,
    SyncStatusCustomerInfoHeaderModule,
    ActiveCaseModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'transaction-view',
    },
  ],
})
export class TransactionViewModule {}
