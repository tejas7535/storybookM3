import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { LegalRoute } from '@schaeffler/legal-pages';

import { AppRoutePath } from './app-route-path.enum';
import { ProdGuard, RoleGuard } from './core/guards';
import { FORBIDDEN_ACTION } from './shared/constants';

export const appRoutePaths: Routes = [
  {
    path: LegalRoute,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: AppRoutePath.BasePath,
    redirectTo: `/${AppRoutePath.CaseViewPath}`,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.ForbiddenPath,
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    data: {
      action: encodeURI(FORBIDDEN_ACTION),
    },
  },
  {
    path: AppRoutePath.ForbiddenCustomerPath,
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    data: {
      action: encodeURI(FORBIDDEN_ACTION),
      messageText: 'errorInterceptorForbidden',
    },
  },

  {
    path: AppRoutePath.CaseViewPath,
    loadChildren: () =>
      import('./case-view/case-view.module').then((m) => m.CaseViewModule),
    canActivateChild: [RoleGuard],
    canActivate: [MsalGuard],
  },
  {
    path: AppRoutePath.ProcessCaseViewPath,
    loadChildren: () =>
      import('./process-case-view/process-case-view.module').then(
        (m) => m.ProcessCaseViewModule
      ),
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.DetailViewPath,
    loadChildren: () =>
      import('./detail-view/detail-view.module').then(
        (m) => m.DetailViewModule
      ),
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.FeatureToggleConfig,
    loadChildren: () =>
      import('./feature-toggle-view/feature-toggle-view.module').then(
        (m) => m.FeatureToggleViewModule
      ),
    canActivate: [ProdGuard],
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
