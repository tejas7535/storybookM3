import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParameterGuard } from '../core/guards';
import { GreaseCalculationPath } from './grease-calculation-path.enum';
import { GreaseCalculationComponent } from './grease-calculation.component';

const routes: Routes = [
  {
    path: GreaseCalculationPath.BasePath,
    component: GreaseCalculationComponent,
    children: [
      {
        path: GreaseCalculationPath.BasePath,
        redirectTo: GreaseCalculationPath.ResultPath, // Todo: Revert when feature done
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
        // canActivate: [ResultGuard],  // Todo: Revert when feature done
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreaseCalculationRoutingModule {}
