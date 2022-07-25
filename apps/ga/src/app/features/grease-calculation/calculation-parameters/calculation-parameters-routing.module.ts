import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculationParametersComponent } from './calculation-parameters.component';

const routes: Routes = [
  {
    path: '',
    component: CalculationParametersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculationParametersRoutingModule {}
