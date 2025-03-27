import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { NavButtonsComponent } from '../shared/nav-buttons/nav-buttons.component';
import { SharedModule } from '../shared/shared.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { AttritionAnalyticsRoutingModule } from './attrition-analytics.routing.module';
import { FeatureAnalysisModule } from './feature-analysis/feature-analysis.module';
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
    SharedTranslocoModule,
    LoadingSpinnerModule,
    FeatureAnalysisModule,
    NavButtonsComponent,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
})
export class AttritionAnalyticsModule {}
