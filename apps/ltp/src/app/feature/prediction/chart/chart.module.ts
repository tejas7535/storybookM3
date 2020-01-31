import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { DxChartModule } from 'devextreme-angular/ui/chart';

import { ChartComponent } from './chart.component';
import { LegendComponent } from './legend/legend.component';

@NgModule({
  declarations: [ChartComponent, LegendComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    FlexLayoutModule,
    DxChartModule
  ],
  exports: [ChartComponent, LegendComponent]
})
export class ChartModule {}
