import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
