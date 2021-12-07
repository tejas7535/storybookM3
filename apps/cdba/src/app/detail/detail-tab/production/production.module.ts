import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelValueModule } from '../label-value/label-value.module';
import { ProductionComponent } from './production.component';

@NgModule({
  declarations: [ProductionComponent],
  imports: [
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [ProductionComponent],
})
export class ProductionModule {}
