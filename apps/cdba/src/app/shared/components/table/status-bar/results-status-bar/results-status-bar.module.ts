import { NgModule } from '@angular/core';

import { InViewModule } from '@cdba/shared/directives/in-view';

import { CompareButtonModule } from '../../button/compare-button';
import { DetailViewButtonModule } from '../../button/detail-view-button';
import { PortfolioAnalysisButtonModule } from '../../button/portfolio-analysis-button';
import { ResultsStatusBarComponent } from './results-status-bar.component';

@NgModule({
  declarations: [ResultsStatusBarComponent],
  imports: [
    InViewModule,
    CompareButtonModule,
    DetailViewButtonModule,
    PortfolioAnalysisButtonModule,
  ],
  exports: [ResultsStatusBarComponent],
})
export class ResultsStatusBarModule {}
