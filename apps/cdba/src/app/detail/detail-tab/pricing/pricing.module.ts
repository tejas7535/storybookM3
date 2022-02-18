import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailsLabelValueModule } from '../details-label-value';
import { PricingComponent } from './pricing.component';

@NgModule({
  declarations: [PricingComponent],
  imports: [
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    DetailsLabelValueModule,
    CommonModule,
  ],
  exports: [PricingComponent],
})
export class PricingModule {}
