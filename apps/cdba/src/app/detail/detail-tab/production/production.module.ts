import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { DetailsLabelValueModule } from '../details-label-value';
import { ProductionComponent } from './production.component';

@NgModule({
  declarations: [ProductionComponent],
  imports: [
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    DetailsLabelValueModule,
  ],
  exports: [ProductionComponent],
})
export class ProductionModule {}
