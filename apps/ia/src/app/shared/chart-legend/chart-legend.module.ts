import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ChartLegendComponent } from './chart-legend.component';

@NgModule({
  declarations: [ChartLegendComponent],
  exports: [ChartLegendComponent],
  imports: [CommonModule, MatTooltipModule, SharedTranslocoModule],
})
export class ChartLegendModule {}
