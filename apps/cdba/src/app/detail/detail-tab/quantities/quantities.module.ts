import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { LabelValueModule } from '../label-value/label-value.module';
import { QuantitiesComponent } from './quantities.component';

@NgModule({
  declarations: [QuantitiesComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [QuantitiesComponent],
})
export class QuantitiesModule {}
