import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { SelectInputModule } from '../shared/select-input/select-input.module';
import { SharedModule } from '../shared/shared.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { AttritionAnalyticsRoutingModule } from './attrition-analytics.routing.module';
import { FeatureAnalysisModule } from './feature-analysis/feature-analysis.module';
import { FeatureImportanceModule } from './feature-importance/feature-importance.module';
import * as fromAttritionAnalytics from './store';
import { AttritionAnalyticsEffects } from './store/effects/attrition-analytics.effects';
import { FeaturesDialogModule } from './features-dialog/features-dialog.module';
import { EditFeatureSelectionModule } from './edit-feature-selection/edit-feature-selection.module';

@NgModule({
  declarations: [AttritionAnalyticsComponent],
  imports: [
    AttritionAnalyticsRoutingModule,
    SharedModule,
    SharedPipesModule,
    StoreModule.forFeature(
      fromAttritionAnalytics.attrtionAnalyticsFeatureKey,
      fromAttritionAnalytics.reducer
    ),
    EffectsModule.forFeature([AttritionAnalyticsEffects]),
    SharedTranslocoModule,
    EditFeatureSelectionModule,
    FeatureImportanceModule,
    FeatureAnalysisModule,
    FeaturesDialogModule,
    SelectInputModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
})
export class AttritionAnalyticsModule {}
