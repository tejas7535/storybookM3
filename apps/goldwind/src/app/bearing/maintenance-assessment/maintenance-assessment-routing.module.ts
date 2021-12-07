import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaintenanceAssessmentComponent } from './maintenance-assessment.component';

const routes: Routes = [
  { path: '', component: MaintenanceAssessmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceAssessmentRoutingModule {}
