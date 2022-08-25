import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { DetailsLabelValueModule } from '../details-label-value';
import { QuantitiesComponent } from './quantities.component';

@NgModule({
  declarations: [QuantitiesComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    DetailsLabelValueModule,
  ],
  exports: [QuantitiesComponent],
})
export class QuantitiesModule {}
