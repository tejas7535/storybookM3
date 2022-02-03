import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { PortfolioAnalysisChartComponent } from './portfolio-analysis-chart.component';
import { PortfolioAnalysisChartService } from './portfolio-analysis-chart.service';

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
