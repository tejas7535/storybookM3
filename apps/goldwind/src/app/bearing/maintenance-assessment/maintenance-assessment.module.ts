import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceAssessmentRoutingModule } from './maintenance-assessment-routing.module';
import { MaintenanceAssessmentComponent } from './maintenance-assessment.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaintenanceAssessmentEffects } from '../../core/store';
import { maintenanceAssessmentReducer } from '../../core/store/reducers/maintenance-assessment/maintenance-assessment.reducer';
import { AssessmentLinechartModule } from '../../shared/chart/assessment-linechart/assessment-linechart.module';
@NgModule({
  declarations: [MaintenanceAssessmentComponent],
  imports: [
    CommonModule,
    MaintenanceAssessmentRoutingModule,
    AssessmentLinechartModule,
    ReactiveFormsModule,
    // UI Modules
    MatCardModule,
    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([MaintenanceAssessmentEffects]),
    StoreModule.forFeature(
      'maintenanceAssessment',
      maintenanceAssessmentReducer
    ),
    ReactiveComponentModule,
  ],
})
export class MaintenanceAssessmentModule {}
