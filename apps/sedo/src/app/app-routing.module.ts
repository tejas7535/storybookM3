import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { AppRoutePath } from './app-route-path.enum';
import { RoleGuard } from './core/guards/role.guard';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.Base,
    loadChildren: () =>
      import('./sales-summary/sales-summary.module').then(
        (m) => m.SalesSummaryModule
      ),
    canActivateChild: [RoleGuard],
    canActivate: [MsalGuard],
  },
  {
    path: AppRoutePath.Forbidden,
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
      useHash: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
