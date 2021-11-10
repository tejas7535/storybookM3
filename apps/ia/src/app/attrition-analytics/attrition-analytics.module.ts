import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BarChartModule } from '../shared/charts/bar-chart/bar-chart.module';
import { SharedModule } from '../shared/shared.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { AttritionAnalyticsRoutingModule } from './attrition-analytics.routing.module';
import { FeaturesDialogModule } from './features-dialog/features-dialog.module';
import * as fromAttritionAnalytics from './store';
import { AttritionAnalyticsEffects } from './store/effects/attrition-analytics.effects';

@NgModule({
  declarations: [AttritionAnalyticsComponent],
  imports: [
    AttritionAnalyticsRoutingModule,
    SharedModule,
    StoreModule.forFeature(
      fromAttritionAnalytics.attrtionAnalyticsFeatureKey,
      fromAttritionAnalytics.reducer
    ),
    EffectsModule.forFeature([AttritionAnalyticsEffects]),
    MatIconModule,
    SharedTranslocoModule,
    FeaturesDialogModule,
    LoadingSpinnerModule,
    DragDropModule,
    BarChartModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
})
export class AttritionAnalyticsModule {}
