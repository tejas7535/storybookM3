import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailsLabelValueModule } from '../details-label-value';
import { ProductionComponent } from './production.component';

@NgModule({
  declarations: [ProductionComponent],
  imports: [SharedTranslocoModule, DetailsLabelValueModule],
  exports: [ProductionComponent],
})
export class ProductionModule {}
