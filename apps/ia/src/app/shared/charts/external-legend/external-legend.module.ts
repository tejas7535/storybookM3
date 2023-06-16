import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { ExternalLegendComponent } from './external-legend.component';

@NgModule({
  declarations: [ExternalLegendComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [ExternalLegendComponent],
})
export class CombinedLegendModule {}
