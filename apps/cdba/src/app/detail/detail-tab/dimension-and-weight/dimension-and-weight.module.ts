import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { DimensionAndWeightComponent } from './dimension-and-weight.component';

@NgModule({
  declarations: [DimensionAndWeightComponent],
  imports: [SharedModule, SharedTranslocoModule],
  exports: [DimensionAndWeightComponent],
})
export class DimensionAndWeightModule {}
