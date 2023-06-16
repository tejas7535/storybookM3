import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { LegalRoute } from '@schaeffler/legal-pages';

import { RoutePath } from '@mac/app-routing.enum';
import { RoleGuard } from '@mac/core/guards';
import { MACRoutes } from '@mac/shared/models';

export const appRoutePaths: MACRoutes = [
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
    canActivate: [MsalGuard],
    path: RoutePath.HardnessConverterPath,
    loadChildren: () =>
      import('./feature/hardness-converter/hardness-converter.module').then(
        (m) => m.HardnessConverterModule
      ),
  },
  {
    canActivate: [MsalGuard],
    path: RoutePath.AQMCalculatorPath,
    loadChildren: () =>
      import('./feature/aqm-calculator/aqm-calculator.module').then(
        (m) => m.AqmCalculatorModule
      ),
  },
  {
    canActivate: [MsalGuard],
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
    path: RoutePath.LearnMorePath,
    loadChildren: () =>
      import('./feature/learn-more/learn-more-routing.module').then(
        (m) => m.LearnMoreRoutingModule
      ),
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
  imports: [RouterModule.forRoot(appRoutePaths, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
