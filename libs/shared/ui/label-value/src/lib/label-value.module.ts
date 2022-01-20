import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LabelValueComponent } from './components/label-value/label-value.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LabelValueComponent],
  exports: [LabelValueComponent],
})
export class LabelValueModule {}
