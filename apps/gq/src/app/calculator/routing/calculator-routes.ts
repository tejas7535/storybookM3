import { Routes } from '@angular/router';

import { CalculatorGuard } from './calculator.guard';
import { CalculatorPaths } from './calculator-paths.enum';

export const CalculatorRoutes: Routes = [
  {
    path: CalculatorPaths.CalculatorOverviewPath,
    pathMatch: 'prefix',
    children: [
      {
        path: CalculatorPaths.ActiveTabPath,
        loadComponent: () =>
          import('./../rfq-4-overview-view/rfq-4-overview-view.component').then(
            (m) => m.Rfq4OverviewViewComponent
          ),
        pathMatch: 'full',
        canActivate: [CalculatorGuard],
        canActivateChild: [CalculatorGuard],
      },
      {
        path: '**',
        loadComponent: () =>
          import('./../rfq-4-overview-view/rfq-4-overview-view.component').then(
            (m) => m.Rfq4OverviewViewComponent
          ),
        pathMatch: 'full',
        canActivate: [CalculatorGuard],
        canActivateChild: [CalculatorGuard],
      },
    ],
  },
  {
    path: CalculatorPaths.Rfq4DetailViewPath,
    loadComponent: () =>
      import('../rfq-4-detail-view/rfq-4-detail-view.component').then(
        (m) => m.Rfq4DetailViewComponent
      ),
    canActivate: [CalculatorGuard],
  },
];
