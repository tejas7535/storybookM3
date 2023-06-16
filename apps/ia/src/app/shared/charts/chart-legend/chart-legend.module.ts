import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ChartLegendComponent } from './chart-legend.component';

@NgModule({
  declarations: [ChartLegendComponent],
  exports: [ChartLegendComponent],
  imports: [CommonModule, MatTooltipModule, SharedTranslocoModule],
})
export class ChartLegendModule {}
