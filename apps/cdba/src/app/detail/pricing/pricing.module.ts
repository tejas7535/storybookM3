import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { PricingComponent } from './pricing.component';

@NgModule({
  declarations: [PricingComponent],
  imports: [SharedModule, SharedTranslocoModule],
  exports: [PricingComponent],
})
export class PricingModule {}
