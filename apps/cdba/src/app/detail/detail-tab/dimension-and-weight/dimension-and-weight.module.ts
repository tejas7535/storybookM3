import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { DetailsLabelValueModule } from '../details-label-value';
import { DimensionAndWeightComponent } from './dimension-and-weight.component';

@NgModule({
  declarations: [DimensionAndWeightComponent],
  imports: [
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    DetailsLabelValueModule,
  ],
  exports: [DimensionAndWeightComponent],
})
export class DimensionAndWeightModule {}
