import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoadAssessmentComponent } from './load-assessment.component';

const routes: Routes = [{ path: '', component: LoadAssessmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadAssessmentRoutingModule {}
