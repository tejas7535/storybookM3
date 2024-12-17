import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { NavButtonsComponent } from '../shared/nav-buttons/nav-buttons.component';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { SelectInputModule } from '../shared/select-input/select-input.module';
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
    SharedPipesModule,
    StoreModule.forFeature(
      fromAttritionAnalytics.attrtionAnalyticsFeatureKey,
      fromAttritionAnalytics.reducer
    ),
    EffectsModule.forFeature([AttritionAnalyticsEffects]),
    SharedTranslocoModule,
    LoadingSpinnerModule,
    FeatureAnalysisModule,
    NavButtonsComponent,
    SelectInputModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
})
export class AttritionAnalyticsModule {}
