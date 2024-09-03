import { NgModule } from '@angular/core';

import { SolidDoughnutChartModule } from '../../../shared/charts/solid-doughnut-chart/solid-doughnut-chart.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReasonsForLeavingChartComponent } from './reasons-for-leaving-chart.component';

@NgModule({
  declarations: [ReasonsForLeavingChartComponent],
  imports: [SharedModule, SolidDoughnutChartModule],
  exports: [ReasonsForLeavingChartComponent],
})
export class ReasonsForLeavingChartModule {}
