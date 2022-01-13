import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  HeatmapStatusEffects,
  MaintenanceAssessmentEffects,
} from '../../core/store';
import { greaseHeatmapStatusReducer } from '../../core/store/reducers/grease-status/heatmap.reducer';
import { maintenanceAssessmentReducer } from '../../core/store/reducers/maintenance-assessment/maintenance-assessment.reducer';
import { AssessmentLinechartModule } from '../../shared/chart/assessment-linechart/assessment-linechart.module';
import { SharedModule } from '../../shared/shared.module';
import { GCMHeatmapCardModule } from './gcm-heatmap-card/gcm-heatmap-card.module';
import { MaintenanceAssessmentComponent } from './maintenance-assessment.component';
import { MaintenanceAssessmentRoutingModule } from './maintenance-assessment-routing.module';
@NgModule({
  declarations: [MaintenanceAssessmentComponent],
  imports: [
    CommonModule,
    MaintenanceAssessmentRoutingModule,
    AssessmentLinechartModule,
    ReactiveFormsModule,
    GCMHeatmapCardModule,
    SharedModule,
    SharedTranslocoModule,
    // Store
    EffectsModule.forFeature([
      MaintenanceAssessmentEffects,
      HeatmapStatusEffects,
    ]),
    StoreModule.forFeature(
      'maintenanceAssessment',
      maintenanceAssessmentReducer
    ),
    StoreModule.forFeature('greaseHeatmapStatus', greaseHeatmapStatusReducer),
    ReactiveComponentModule,
  ],
})
export class MaintenanceAssessmentModule {}
