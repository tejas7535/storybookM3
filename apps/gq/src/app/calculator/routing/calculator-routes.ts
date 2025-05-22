import { Routes } from '@angular/router';

import { CalculatorGuard } from './calculator.guard';

export enum CalculatorPaths {
  CalculatorOverviewPath = 'calculator-overview',
  ActiveTabPath = ':calculatorTab',
  Rfq4DetailViewPath = 'rfq-4-detail-view',
}

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
      },
      {
        path: '**',
        loadComponent: () =>
          import('./../rfq-4-overview-view/rfq-4-overview-view.component').then(
            (m) => m.Rfq4OverviewViewComponent
          ),
        pathMatch: 'full',
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
