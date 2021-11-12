import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { BasicRoleGuard, DescriptiveRoleGuard } from './core/auth';

import { AppRoutePath } from './app-route-path.enum';

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
    canActivateChild: [BasicRoleGuard, DescriptiveRoleGuard],
  },
  {
    path: AppRoutePath.ResultsPath,
    loadChildren: async () =>
      import('./results/results.module').then((m) => m.ResultsModule),
    canActivate: [MsalGuard],
    canActivateChild: [BasicRoleGuard, DescriptiveRoleGuard],
  },
  {
    path: AppRoutePath.DetailPath,
    loadChildren: async () =>
      import('./detail/detail.module').then((m) => m.DetailModule),
    canActivate: [MsalGuard],
    canActivateChild: [BasicRoleGuard, DescriptiveRoleGuard],
  },
  {
    path: AppRoutePath.ComparePath,
    loadChildren: async () =>
      import('./compare/compare.module').then((m) => m.CompareModule),
    canActivate: [MsalGuard],
    canActivateChild: [BasicRoleGuard, DescriptiveRoleGuard],
  },
  {
    path: AppRoutePath.EmptyStatesPath,
    loadChildren: async () =>
      import('./core/empty-states/empty-states.module').then(
        (m) => m.EmptyStatesModule
      ),
  },
  {
    path: '**',
    redirectTo: `/${AppRoutePath.EmptyStatesPath}`,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
