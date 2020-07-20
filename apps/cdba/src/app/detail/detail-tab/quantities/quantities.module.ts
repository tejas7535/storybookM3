import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { QuantitiesComponent } from './quantities.component';

@NgModule({
  declarations: [QuantitiesComponent],
  imports: [SharedModule, SharedTranslocoModule],
  exports: [QuantitiesComponent],
})
export class QuantitiesModule {}
