import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LabelValueComponent } from './components/label-value/label-value.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  declarations: [LabelValueComponent],
  exports: [LabelValueComponent],
})
export class LabelValueModule {}
