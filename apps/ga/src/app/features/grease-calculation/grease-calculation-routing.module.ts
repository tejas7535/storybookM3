import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  CalculationParametersGuard,
  CalculationResultGuard,
} from '../../core/guards';
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
        pathMatch: 'full',
      },
      {
        path: `${GreaseCalculationPath.BearingPath}`,
        loadChildren: () =>
          import('./bearing-selection/bearing-selection.module').then(
            (m) => m.BearingSelectionModule
          ),
      },
      {
        path: `${GreaseCalculationPath.ParametersPath}`,
        loadComponent: () =>
          import(
            './calculation-parameters/calculation-parameters.component'
          ).then((m) => m.CalculationParametersComponent),
        canActivate: [CalculationParametersGuard],
      },
      {
        path: GreaseCalculationPath.ResultPath,
        loadChildren: () =>
          import('./calculation-result/calculation-result.module').then(
            (m) => m.CalculationResultModule
          ),
        canActivate: [CalculationResultGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreaseCalculationRoutingModule {}
