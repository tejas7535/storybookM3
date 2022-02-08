import { NgModule } from '@angular/core';

import { InViewModule } from '@cdba/shared/directives/in-view';

import { CompareButtonModule } from '../../button/compare-button';
import { PortfolioAnalysisButtonModule } from '../../button/portfolio-analysis-button';
import { ResultsStatusBarComponent } from './results-status-bar.component';

@NgModule({
  declarations: [ResultsStatusBarComponent],
  imports: [InViewModule, CompareButtonModule, PortfolioAnalysisButtonModule],
  exports: [ResultsStatusBarComponent],
})
export class ResultsStatusBarModule {}
