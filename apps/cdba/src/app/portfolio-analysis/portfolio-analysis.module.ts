import { NgModule } from '@angular/core';

import { BetaFeatureModule, PageHeaderModule } from '@cdba/shared/components';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PortfolioAnalysisComponent } from './portfolio-analysis.component';
import { PortfolioAnalysisRoutingModule } from './portfolio-analysis.routing.module';
import { PortfolioAnalysisChartModule } from './portfolio-analysis-chart/portfolio-analysis-chart.module';
import { PortfolioAnalysisTableModule } from './portfolio-analysis-table/portfolio-analysis-table.module';

@NgModule({
  declarations: [PortfolioAnalysisComponent],
  imports: [
    ReactiveComponentModule,
    SharedTranslocoModule,
    PortfolioAnalysisRoutingModule,
    BreadcrumbsModule,
    PageHeaderModule,
    BetaFeatureModule,
    PortfolioAnalysisChartModule,
    PortfolioAnalysisTableModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'portfolio-analysis' }],
})
export class PortfolioAnalysisModule {}
