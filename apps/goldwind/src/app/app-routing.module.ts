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
    loadChildren: () =>
      import('./overview/overview.module').then((m) => m.OverviewModule),
    canActivate: [MsalGuard],
  },
  {
    path: AppRoutePath.BearingPath,
    loadChildren: () =>
      import('./bearing/bearing.module').then((m) => m.BearingModule),
    canActivate: [MsalGuard],
  },
  {
    path: AppRoutePath.ForbiddenPath,
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
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
