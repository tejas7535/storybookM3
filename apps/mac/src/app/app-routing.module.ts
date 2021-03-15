import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { RoutePath } from './app-routing.enum';

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.OverviewPath}`,
    pathMatch: 'full',
  },
  {
    canActivate: [MsalGuard],
    path: RoutePath.OverviewPath,
    loadChildren: () =>
      import('./feature/overview/overview.module').then(
        (m) => m.OverviewModule
      ),
  },
  {
    canLoad: [MsalGuard],
    path: RoutePath.HardnessConverterPath,
    loadChildren: () =>
      import('./feature/hardness-converter/hardness-converter.module').then(
        (m) => m.HardnessConverterModule
      ),
  },
  {
    canLoad: [MsalGuard],
    path: RoutePath.AQMCalculatorPath,
    loadChildren: () =>
      import('./feature/aqm-calculator/aqm-calculator.module').then(
        (m) => m.AqmCalculatorModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutePaths, {
      useHash: true,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
