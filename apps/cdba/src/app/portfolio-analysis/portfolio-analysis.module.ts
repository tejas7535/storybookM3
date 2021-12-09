import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BetaFeatureModule, PageHeaderModule } from '@cdba/shared/components';

import { PortfolioAnalysisChartModule } from './portfolio-analysis-chart/portfolio-analysis-chart.module';
import { PortfolioAnalysisTableModule } from './portfolio-analysis-table/portfolio-analysis-table.module';
import { PortfolioAnalysisComponent } from './portfolio-analysis.component';
import { PortfolioAnalysisRoutingModule } from './portfolio-analysis.routing.module';

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
