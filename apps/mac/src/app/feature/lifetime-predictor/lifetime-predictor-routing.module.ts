import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LifetimePredictorComponent } from './lifetime-predictor.component';

const routes: Routes = [{ path: '', component: LifetimePredictorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LifetimePredictorRoutingModule {}
