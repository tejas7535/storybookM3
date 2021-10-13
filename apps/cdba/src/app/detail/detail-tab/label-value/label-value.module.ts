import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LabelValueComponent } from './label-value.component';

@NgModule({
  declarations: [LabelValueComponent],
  imports: [CommonModule],
  exports: [LabelValueComponent],
})
export class LabelValueModule {}
