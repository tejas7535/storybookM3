import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '@cdba/shared/pipes';

import { DetailsLabelValueModule } from '../details-label-value';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

@NgModule({
  declarations: [SalesAndDescriptionComponent],
  imports: [
    SharedTranslocoModule,
    MaterialNumberModule,
    DetailsLabelValueModule,
    CommonModule,
  ],
  exports: [SalesAndDescriptionComponent],
})
export class SalesAndDescriptionModule {}
