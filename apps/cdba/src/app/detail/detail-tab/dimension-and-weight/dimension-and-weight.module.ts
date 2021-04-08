import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { SharedModule } from '../../../shared/shared.module';
import { DimensionAndWeightComponent } from './dimension-and-weight.component';

@NgModule({
  declarations: [DimensionAndWeightComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [DimensionAndWeightComponent],
})
export class DimensionAndWeightModule {}
