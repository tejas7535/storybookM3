import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { RoutePath } from './app-routing.enum';
import { RoleGuard } from './core/guards/role.guard';

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.OverviewPath}`,
    pathMatch: 'full',
  },
  {
    canActivate: [MsalGuard],
    path: RoutePath.OverviewPath,
    loadChildren: async () =>
      import('./feature/overview/overview.module').then(
        (m) => m.OverviewModule
      ),
  },
  {
    canLoad: [MsalGuard],
    path: RoutePath.HardnessConverterPath,
    loadChildren: async () =>
      import('./feature/hardness-converter/hardness-converter.module').then(
        (m) => m.HardnessConverterModule
      ),
  },
  {
    canLoad: [MsalGuard],
    path: RoutePath.AQMCalculatorPath,
    loadChildren: async () =>
      import('./feature/aqm-calculator/aqm-calculator.module').then(
        (m) => m.AqmCalculatorModule
      ),
  },
  {
    canLoad: [MsalGuard],
    canActivateChild: [RoleGuard],
    path: RoutePath.LifetimePredictorPath,
    loadChildren: async () =>
      import('./feature/lifetime-predictor/lifetime-predictor.module').then(
        (m) => m.LifetimePredictorModule
      ),
    data: {
      requiredRoles: ['lifetime-predictor-user'],
    },
  },
  {
    canLoad: [MsalGuard],
    canActivateChild: [RoleGuard],
    path: RoutePath.MaterialsSupplierDatabasePath,
    loadChildren: async () =>
      import(
        './feature/materials-supplier-database/materials-supplier-database.module'
      ).then((m) => m.MaterialsSupplierDatabaseModule),
    data: {
      requiredRoles: ['material-supplier-database-read-user'],
    },
  },
  {
    path: 'forbidden',
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  },
  {
    path: '**',
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutePaths, {
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
