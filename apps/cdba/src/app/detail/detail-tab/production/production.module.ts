import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { LabelValueModule } from '../label-value/label-value.module';
import { ProductionComponent } from './production.component';

@NgModule({
  declarations: [ProductionComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [ProductionComponent],
})
export class ProductionModule {}
