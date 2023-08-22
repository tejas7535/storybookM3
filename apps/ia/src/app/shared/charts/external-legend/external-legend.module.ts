import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExternalLegendComponent } from './external-legend.component';

@NgModule({
  declarations: [ExternalLegendComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [ExternalLegendComponent],
})
export class CombinedLegendModule {}
