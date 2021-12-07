import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HorizontalDividerModule } from '../../shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { BasicCustomerComponent } from './basic-customer/basic-customer.component';
import { CustomerInformationComponent } from './customer-information.component';
import { KeyaccountComponent } from './keyaccount/keyaccount.component';
import { SalesforceComponent } from './salesforce/salesforce.component';

@NgModule({
  declarations: [
    CustomerInformationComponent,
    BasicCustomerComponent,
    SalesforceComponent,
    KeyaccountComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    SharedTranslocoModule,
    SharedPipesModule,
    HorizontalDividerModule,
    LabelTextModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'customer-view',
    },
  ],
  exports: [CustomerInformationComponent],
})
export class CustomerInformationModule {}
