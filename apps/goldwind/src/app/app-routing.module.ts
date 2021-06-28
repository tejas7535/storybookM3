import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { AppRoutePath } from './app-route-path.enum';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    redirectTo: `/${AppRoutePath.OverviewPath}`,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.OverviewPath,
    loadChildren: async () =>
      import('./overview/overview.module').then((m) => m.OverviewModule),
    canActivate: [MsalGuard],
  },
  {
    path: AppRoutePath.BearingPath,
    loadChildren: async () =>
      import('./bearing/bearing.module').then((m) => m.BearingModule),
    canActivate: [MsalGuard],
  },
  {
    path: AppRoutePath.LegalPath,
    loadChildren: async () =>
      import('./legal/legal.module').then((m) => m.LegalModule),
  },
  {
    path: AppRoutePath.ForbiddenPath,
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
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
