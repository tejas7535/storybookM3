import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { PortfolioAnalysisChartService } from './portfolio-analysis-chart.service';

import { PortfolioAnalysisChartComponent } from './portfolio-analysis-chart.component';

@NgModule({
  declarations: [PortfolioAnalysisChartComponent],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: async () => import('./echarts-bundle'),
    }),
  ],
  providers: [PortfolioAnalysisChartService],
  exports: [PortfolioAnalysisChartComponent],
})
export class PortfolioAnalysisChartModule {}
