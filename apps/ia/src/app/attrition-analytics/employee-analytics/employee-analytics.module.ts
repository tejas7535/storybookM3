import { NgModule } from '@angular/core';

import { BarChartModule } from '../../shared/charts/bar-chart/bar-chart.module';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeAnalyticsComponent } from './employee-analytics.component';

@NgModule({
  declarations: [EmployeeAnalyticsComponent],
  imports: [SharedModule, BarChartModule],
  exports: [EmployeeAnalyticsComponent],
})
export class EmployeeAnalyticsModule {}
