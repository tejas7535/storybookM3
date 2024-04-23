import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BetaFeatureModule } from '@cdba/shared/components';

import { PortfolioAnalysisComponent } from './portfolio-analysis.component';
import { PortfolioAnalysisRoutingModule } from './portfolio-analysis.routing.module';
import { PortfolioAnalysisChartModule } from './portfolio-analysis-chart/portfolio-analysis-chart.module';
import { PortfolioAnalysisTableModule } from './portfolio-analysis-table/portfolio-analysis-table.module';

@NgModule({
  declarations: [PortfolioAnalysisComponent],
  imports: [
    PushPipe,
    SharedTranslocoModule,
    PortfolioAnalysisRoutingModule,
    SubheaderModule,
    BetaFeatureModule,
    PortfolioAnalysisChartModule,
    PortfolioAnalysisTableModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'portfolio-analysis' }],
})
export class PortfolioAnalysisModule {}
