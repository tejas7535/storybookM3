import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/auth.guard';

export enum RoutePath {
  BasePath = '',
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    loadChildren: () =>
      import('./sales-summary/sales-summary.module').then(
        (m) => m.SalesSummaryModule
      ),
    canActivate: [AuthGuard],
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
      initialNavigation: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
