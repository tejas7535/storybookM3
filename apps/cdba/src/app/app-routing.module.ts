import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { ForbiddenRoute } from '@schaeffler/empty-states';

import { BasicRoleGuard } from './core/auth';

import { AppRoutePath } from './app-route-path.enum';
import { FORBIDDEN_ACTION } from './shared/constants';

/**
 * Show this page when the user does not have the basic access rights for the app
 */
const forbiddenRouteBasic: ForbiddenRoute = {
  path: AppRoutePath.ForbiddenPath,
  loadChildren: async () =>
    import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  data: {
    headingText: 'forbidden.noBasicAccess.heading',
    messageText: 'forbidden.noBasicAccess.message',
    action: encodeURI(FORBIDDEN_ACTION),
    hideHomeButton: true,
  },
  canActivate: [MsalGuard],
};

/**
 * Show this page when the user does not have access rights for specific feature
 */
const forbiddenRouteFeature: ForbiddenRoute = {
  path: AppRoutePath.NoAccessToFeaturePath,
  loadChildren: async () =>
    import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  data: {
    headingText: 'forbidden.noFeatureAccess.heading',
    messageText: 'forbidden.noFeatureAccess.message',
    action: encodeURI(FORBIDDEN_ACTION),
    homeButtonText: 'forbidden.noFeatureAccess.homeButton',
  },
  canActivate: [MsalGuard],
};

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
    canActivateChild: [BasicRoleGuard],
  },
  {
    path: AppRoutePath.ResultsPath,
    loadChildren: async () =>
      import('./results/results.module').then((m) => m.ResultsModule),
    canActivate: [MsalGuard],
    canActivateChild: [BasicRoleGuard],
  },
  {
    path: AppRoutePath.DetailPath,
    loadChildren: async () =>
      import('./detail/detail.module').then((m) => m.DetailModule),
    canActivate: [MsalGuard],
    canActivateChild: [BasicRoleGuard],
  },
  {
    path: AppRoutePath.ComparePath,
    loadChildren: async () =>
      import('./compare/compare.module').then((m) => m.CompareModule),
    canActivate: [MsalGuard],
    canActivateChild: [BasicRoleGuard],
  },
  forbiddenRouteBasic,
  forbiddenRouteFeature,
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
