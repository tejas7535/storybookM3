import { NgModule } from '@angular/core';

import {
  MaterialNumberModule,
  UndefinedAttributeFallbackModule,
} from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
