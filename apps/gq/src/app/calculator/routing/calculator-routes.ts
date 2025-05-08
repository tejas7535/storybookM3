import { Routes } from '@angular/router';

export enum CalculatorPaths {
  CalculatorOverviewPath = 'calculator-overview',
  ActiveTabPath = ':calculatorTab',
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
];
