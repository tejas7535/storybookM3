import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BarChartModule } from '../../shared/charts/bar-chart/bar-chart.module';
import { SharedModule } from '../../shared/shared.module';
import { FeatureAnalysisComponent } from './feature-analysis.component';

@NgModule({
  declarations: [FeatureAnalysisComponent],
  imports: [
    SharedModule,
    LoadingSpinnerModule,
    SharedTranslocoModule,
    BarChartModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
  exports: [FeatureAnalysisComponent],
})
export class FeatureAnalysisModule {}
