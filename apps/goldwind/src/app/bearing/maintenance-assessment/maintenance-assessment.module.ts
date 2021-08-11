import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceAssessmentRoutingModule } from './maintenance-assessment-routing.module';
import { MaintenanceAssessmentComponent } from './maintenance-assessment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  HeatmapStatusEffects,
  MaintenanceAssessmentEffects,
} from '../../core/store';
import { maintenanceAssessmentReducer } from '../../core/store/reducers/maintenance-assessment/maintenance-assessment.reducer';
import { AssessmentLinechartModule } from '../../shared/chart/assessment-linechart/assessment-linechart.module';
import { greaseHeatmapStatusReducer } from '../../core/store/reducers/grease-status/heatmap.reducer';
import { GCMHeatmapCardModule } from './gcm-heatmap-card/gcm-heatmap-card.module';
@NgModule({
  declarations: [MaintenanceAssessmentComponent],
  imports: [
    CommonModule,
    MaintenanceAssessmentRoutingModule,
    AssessmentLinechartModule,
    ReactiveFormsModule,
    GCMHeatmapCardModule,
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
