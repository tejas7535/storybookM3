import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BarChartModule } from '../../shared/charts/bar-chart/bar-chart.module';
import { SharedModule } from '../../shared/shared.module';
import { FeaturesDialogModule } from '../features-dialog/features-dialog.module';
import { FeatureAnalysisComponent } from './feature-analysis.component';

@NgModule({
  declarations: [FeatureAnalysisComponent],
  imports: [
    SharedModule,
    DragDropModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    LoadingSpinnerModule,
    SharedTranslocoModule,
    FeaturesDialogModule,
    BarChartModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
  exports: [FeatureAnalysisComponent],
})
export class FeatureAnalysisModule {}
