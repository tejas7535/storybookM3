import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicCustomerComponent } from './basic-customer/basic-customer.component';
import { CustomerDetailsTabComponent } from './customer-details-tab.component';
import { CustomerDetailsTabRoutingModule } from './customer-details-tab.routing.module';
import { KeyaccountComponent } from './keyaccount/keyaccount.component';
import { SalesforceComponent } from './salesforce/salesforce.component';

@NgModule({
  declarations: [
    CustomerDetailsTabComponent,
    BasicCustomerComponent,
    KeyaccountComponent,
    SalesforceComponent,
  ],
  imports: [
    CommonModule,
    ActiveCaseModule,
    MatCardModule,
    PushPipe,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    CustomerDetailsTabRoutingModule,
    LabelTextModule,
    HorizontalDividerModule,
    SharedPipesModule,
    KpiStatusCardComponent,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'process-case-view',
    },
  ],
  exports: [CustomerDetailsTabComponent],
})
export class CustomerDetailsTabModule {}
