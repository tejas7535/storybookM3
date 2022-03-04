import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { LegalRoute } from '@schaeffler/legal-pages';

import { AppRoutePath } from './app-route-path.enum';
import { RoleGuard } from './core/guards';
import { FORBIDDEN_ACTION } from './shared/constants';

export const appRoutePaths: Routes = [
  {
    path: LegalRoute,
    loadChildren: async () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: AppRoutePath.BasePath,
    redirectTo: `/${AppRoutePath.CaseViewPath}`,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.ForbiddenPath,
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    data: {
      action: encodeURI(FORBIDDEN_ACTION),
    },
  },
  {
    path: AppRoutePath.CaseViewPath,
    loadChildren: async () =>
      import('./case-view/case-view.module').then((m) => m.CaseViewModule),
    canActivateChild: [RoleGuard],
    canActivate: [MsalGuard],
  },
  {
    path: AppRoutePath.ProcessCaseViewPath,
    loadChildren: async () =>
      import('./process-case-view/process-case-view.module').then(
        (m) => m.ProcessCaseViewModule
      ),
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.DetailViewPath,
    loadChildren: async () =>
      import('./detail-view/detail-view.module').then(
        (m) => m.DetailViewModule
      ),
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.CustomerViewPath,
    loadChildren: async () =>
      import('./customer-view/customer-view.module').then(
        (m) => m.CustomerViewModule
      ),
    canActivateChild: [RoleGuard],
  },
  {
    path: '**',
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];
export class ProcessCaseViewQueryParams {
  quotation_number: number;
  customer_number: string;
  sales_org: string;
}
export class DetailViewQueryParams extends ProcessCaseViewQueryParams {
  gqPositionId: string;
}

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
