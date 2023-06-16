import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SelectInputModule } from '../shared/select-input/select-input.module';
import { SharedModule } from '../shared/shared.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { AttritionAnalyticsRoutingModule } from './attrition-analytics.routing.module';
import { FeatureAnalysisModule } from './feature-analysis/feature-analysis.module';
import { FeatureImportanceModule } from './feature-importance/feature-importance.module';
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
    FeatureImportanceModule,
    FeatureAnalysisModule,
    SelectInputModule,
    MatCardModule,
    MatChipsModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
})
export class AttritionAnalyticsModule {}
