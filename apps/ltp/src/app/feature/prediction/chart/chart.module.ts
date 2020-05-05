import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DxChartModule } from 'devextreme-angular/ui/chart';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ChartComponent } from './chart.component';
import { LegendComponent } from './legend/legend.component';

@NgModule({
  declarations: [ChartComponent, LegendComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    FlexLayoutModule,
    DxChartModule,
  ],
  exports: [ChartComponent, LegendComponent],
})
export class ChartModule {}
