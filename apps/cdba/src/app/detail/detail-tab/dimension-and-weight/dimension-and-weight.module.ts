import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelValueModule } from '../label-value/label-value.module';
import { DimensionAndWeightComponent } from './dimension-and-weight.component';

@NgModule({
  declarations: [DimensionAndWeightComponent],
  imports: [
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [DimensionAndWeightComponent],
})
export class DimensionAndWeightModule {}
