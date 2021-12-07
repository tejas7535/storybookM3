import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelValueModule } from '../label-value/label-value.module';
import { CustomerComponent } from './customer.component';

@NgModule({
  declarations: [CustomerComponent],
  imports: [
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [CustomerComponent],
})
export class CustomerModule {}
