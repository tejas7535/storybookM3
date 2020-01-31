import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatDividerModule,
  MatExpansionModule,
  MatMenuModule,
  MatTabsModule
} from '@angular/material';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { TooltipModule } from '../../shared/components/tooltip/tooltip.module';
import { ChartModule } from './chart/chart.module';

import { KpiComponent } from './kpi/kpi.component';
import { PredictionComponent } from './prediction.component';

@NgModule({
  declarations: [PredictionComponent, KpiComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    SharedTranslocoModule,
    ChartModule,
    MatExpansionModule,
    MatDividerModule,
    TooltipModule
  ],
  exports: [PredictionComponent]
})
export class PredictionModule {}
