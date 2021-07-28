import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadAssessmentEffects } from '../../core/store';
import { loadAssessmentReducer } from '../../core/store/reducers/load-assessment/load-assessment.reducer';
import { DateRangeModule } from '../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../shared/empty-graph/empty-graph.module';
import { SharedModule } from '../../shared/shared.module';
import { CenterLoadModule } from '../condition-monitoring/center-load/center-load.module';
import { LoadAssessmentRoutingModule } from './load-assessment-routing.module';
import { LoadAssessmentComponent } from './load-assessment.component';
import { centerLoadReducer } from '../../core/store/reducers/center-load/center-load.reducer';

@NgModule({
  declarations: [LoadAssessmentComponent],
  imports: [
    CommonModule,
    LoadAssessmentRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DateRangeModule,
    EmptyGraphModule,
    NgxEchartsModule.forRoot({
      echarts: async () => import('../../shared/chart/echarts'),
    }),
    CenterLoadModule,

    // UI Modules
    MatCardModule,
    MatCheckboxModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,

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
