import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { DetailsLabelValueComponent } from './details-label-value.component';

@NgModule({
  declarations: [DetailsLabelValueComponent],
  imports: [CommonModule, UndefinedAttributeFallbackModule],
  exports: [DetailsLabelValueComponent],
})
export class DetailsLabelValueModule {}
