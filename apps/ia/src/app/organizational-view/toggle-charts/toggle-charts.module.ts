import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ToggleChartsComponent } from './toggle-charts.component';

@NgModule({
  declarations: [ToggleChartsComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  exports: [ToggleChartsComponent],
})
export class ToggleChartsModule {}
