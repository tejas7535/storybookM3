import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { MaterialPriceHeaderContentModule } from '@gq/shared/components/header/material-price-header-content/material-price-header-content.module';
import { StatusCustomerInfoHeaderModule } from '@gq/shared/components/header/status-customer-info-header/status-customer-info-header.module';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@jsverse/transloco';
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
    StatusCustomerInfoHeaderModule,
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
