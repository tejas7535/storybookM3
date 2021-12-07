import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadAssessmentEffects } from '../../core/store';
import { centerLoadReducer } from '../../core/store/reducers/center-load/center-load.reducer';
import { loadAssessmentReducer } from '../../core/store/reducers/load-assessment/load-assessment.reducer';
import { AssessmentLinechartModule } from '../../shared/chart/assessment-linechart/assessment-linechart.module';
import { LoadDistributionCardModule } from '../condition-monitoring/load-distribution-card/load-distribution-card.module';
import { LoadAssessmentComponent } from './load-assessment.component';
import { LoadAssessmentRoutingModule } from './load-assessment-routing.module';

@NgModule({
  declarations: [LoadAssessmentComponent],
  imports: [
    CommonModule,
    LoadAssessmentRoutingModule,
    ReactiveFormsModule,
    LoadDistributionCardModule,
    // UI Modules
    MatCardModule,
    AssessmentLinechartModule,
    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([LoadAssessmentEffects]),
    StoreModule.forFeature('loadAssessment', loadAssessmentReducer),
    StoreModule.forFeature('center-load', centerLoadReducer),
    ReactiveComponentModule,
  ],
})
export class LoadAssessmentModule {}
