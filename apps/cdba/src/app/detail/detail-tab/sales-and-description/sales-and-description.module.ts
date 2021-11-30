import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  MaterialNumberModule,
  UndefinedAttributeFallbackModule,
} from '@cdba/shared/pipes';

import { LabelValueModule } from '../label-value/label-value.module';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

@NgModule({
  declarations: [SalesAndDescriptionComponent],
  imports: [
    SharedTranslocoModule,
    MaterialNumberModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [SalesAndDescriptionComponent],
})
export class SalesAndDescriptionModule {}
