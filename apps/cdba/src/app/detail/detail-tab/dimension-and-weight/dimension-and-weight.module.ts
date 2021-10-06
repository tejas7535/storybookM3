import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { LabelValueModule } from '../label-value/label-value.module';
import { DimensionAndWeightComponent } from './dimension-and-weight.component';

@NgModule({
  declarations: [DimensionAndWeightComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [DimensionAndWeightComponent],
})
export class DimensionAndWeightModule {}
