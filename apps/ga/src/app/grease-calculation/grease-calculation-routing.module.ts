import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GreaseCalculationPath } from './grease-calculation-path.enum';
import { GreaseCalculationComponent } from './grease-calculation.component';

const routes: Routes = [
  {
    path: GreaseCalculationPath.BasePath,
    component: GreaseCalculationComponent,
    children: [
      {
        path: GreaseCalculationPath.BasePath,
        redirectTo: GreaseCalculationPath.BearingPath,
      },
      {
        path: `${GreaseCalculationPath.BearingPath}`,
        loadChildren: async () =>
          import('../bearing/bearing.module').then((m) => m.BearingModule),
      },
      {
        path: `${GreaseCalculationPath.ParametersPath}`,
        loadChildren: async () =>
          import('../parameters/parameters.module').then(
            (m) => m.ParametersModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreaseCalculationRoutingModule {}
