import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LabelValueComponent } from './components/label-value/label-value.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  declarations: [LabelValueComponent],
  exports: [LabelValueComponent],
})
export class LabelValueModule {}
