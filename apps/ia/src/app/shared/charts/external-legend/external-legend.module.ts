import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExternalLegendComponent } from './external-legend.component';

@NgModule({
  declarations: [ExternalLegendComponent],
  imports: [CommonModule],
  exports: [ExternalLegendComponent],
})
export class CombinedLegendModule {}
