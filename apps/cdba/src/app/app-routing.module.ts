import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { RoleGuard } from './core/auth';

import { AppRoutePath } from './app-route-path.enum';
import { FORBIDDEN_ACTION } from './shared/constants';

export const appRoutes: Routes = [
  {
    path: AppRoutePath.BasePath,
    redirectTo: `/${AppRoutePath.SearchPath}`,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.SearchPath,
    loadChildren: async () =>
      import('./search/search.module').then((m) => m.SearchModule),
    canActivate: [MsalGuard],
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.ResultsPath,
    loadChildren: async () =>
      import('./results/results.module').then((m) => m.ResultsModule),
    canActivate: [MsalGuard],
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.DetailPath,
    loadChildren: async () =>
      import('./detail/detail.module').then((m) => m.DetailModule),
    canActivate: [MsalGuard],
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.ComparePath,
    loadChildren: async () =>
      import('./compare/compare.module').then((m) => m.CompareModule),
    canActivate: [MsalGuard],
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.ForbiddenPath,
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    data: {
      action: encodeURI(FORBIDDEN_ACTION),
    },
    canActivate: [MsalGuard],
  },
  {
    path: '**',
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
