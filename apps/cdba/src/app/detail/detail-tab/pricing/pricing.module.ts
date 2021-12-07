import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelValueModule } from '../label-value/label-value.module';
import { PricingComponent } from './pricing.component';

@NgModule({
  declarations: [PricingComponent],
  imports: [
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [PricingComponent],
})
export class PricingModule {}
