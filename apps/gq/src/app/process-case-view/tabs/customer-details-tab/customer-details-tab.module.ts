import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ProcessCaseEffects } from '@gq/core/store/effects';
import { processCaseReducer } from '@gq/core/store/reducers/process-case/process-case.reducer';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HorizontalDividerModule } from '../../../shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '../../../shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
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
    EffectsModule.forFeature([ProcessCaseEffects]),
    StoreModule.forFeature('processCase', processCaseReducer),
    MatCardModule,
    PushModule,
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
