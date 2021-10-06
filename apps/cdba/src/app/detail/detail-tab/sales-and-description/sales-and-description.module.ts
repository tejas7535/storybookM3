import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { LabelValueModule } from '../label-value/label-value.module';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

@NgModule({
  declarations: [SalesAndDescriptionComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
    LabelValueModule,
  ],
  exports: [SalesAndDescriptionComponent],
})
export class SalesAndDescriptionModule {}
