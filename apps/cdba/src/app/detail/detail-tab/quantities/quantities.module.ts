import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { LabelValueModule } from '../label-value/label-value.module';
import { QuantitiesComponent } from './quantities.component';

@NgModule({
  declarations: [QuantitiesComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [QuantitiesComponent],
})
export class QuantitiesModule {}
