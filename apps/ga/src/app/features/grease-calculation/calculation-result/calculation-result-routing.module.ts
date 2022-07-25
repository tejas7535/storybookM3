import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculationResultComponent } from './calculation-result.component';

const routes: Routes = [
  {
    path: '',
    component: CalculationResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculationResultRoutingModule {}
