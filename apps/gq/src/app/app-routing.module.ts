import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutePath } from './app-route-path.enum';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    redirectTo: `/${AppRoutePath.CaseViewPath}`,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.CaseViewPath,
    loadChildren: () =>
      import('./case-view/case-view.module').then((m) => m.CaseViewModule),
  },
  {
    path: AppRoutePath.ProcessCaseViewPath,
    loadChildren: () =>
      import('./process-case-view/process-case-view.module').then(
        (m) => m.ProcessCaseViewModule
      ),
  },
  {
    path: AppRoutePath.DetailViewPath,
    loadChildren: () =>
      import('./detail-view/detail-view.module').then(
        (m) => m.DetailViewModule
      ),
  },
  {
    path: AppRoutePath.OfferViewPath,
    loadChildren: () =>
      import('./offer-view/offer-view.module').then((m) => m.OfferViewModule),
  },
  {
    path: AppRoutePath.CustomerViewPath,
    loadChildren: () =>
      import('./customer-view/customer-view.module').then(
        (m) => m.CustomerViewModule
      ),
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
      useHash: true,
      initialNavigation: 'disabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
