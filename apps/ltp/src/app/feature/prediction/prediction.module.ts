import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

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
    TooltipModule,
    MatIconModule
  ],
  exports: [PredictionComponent]
})
export class PredictionModule {}
