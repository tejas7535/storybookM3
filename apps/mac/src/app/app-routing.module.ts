import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { LegalRoute } from '@schaeffler/legal-pages';

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
    canLoad: [MsalGuard],
    canActivateChild: [RoleGuard],
    path: RoutePath.LifetimePredictorPath,
    loadChildren: () =>
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
    loadChildren: () =>
      import(
        './feature/materials-supplier-database/materials-supplier-database.module'
      ).then((m) => m.MaterialsSupplierDatabaseModule),
    data: {
      requiredRoles: ['material-supplier-database-read-user'],
    },
  },
  {
    path: LegalRoute,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: 'forbidden',
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
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
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
