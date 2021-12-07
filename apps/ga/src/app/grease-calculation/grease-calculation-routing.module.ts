import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParameterGuard, ResultGuard } from '../core/guards';
import { GreaseCalculationComponent } from './grease-calculation.component';
import { GreaseCalculationPath } from './grease-calculation-path.enum';

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
        canActivate: [ParameterGuard],
      },
      {
        path: GreaseCalculationPath.ResultPath,
        loadChildren: async () =>
          import('../result/result.module').then((m) => m.ResultModule),
        canActivate: [ResultGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreaseCalculationRoutingModule {}
