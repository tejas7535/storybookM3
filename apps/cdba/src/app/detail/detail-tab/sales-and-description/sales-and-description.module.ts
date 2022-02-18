import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  MaterialNumberModule,
  UndefinedAttributeFallbackModule,
} from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailsLabelValueModule } from '../details-label-value';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

@NgModule({
  declarations: [SalesAndDescriptionComponent],
  imports: [
    SharedTranslocoModule,
    MaterialNumberModule,
    UndefinedAttributeFallbackModule,
    DetailsLabelValueModule,
    CommonModule,
  ],
  exports: [SalesAndDescriptionComponent],
})
export class SalesAndDescriptionModule {}
