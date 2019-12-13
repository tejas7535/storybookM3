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

import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
    ChartModule,
    MatExpansionModule,
    MatDividerModule,
    TooltipModule
  ],
  exports: [PredictionComponent]
})
export class PredictionModule {}
