import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = '',
  OverviewPath = 'overview',
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.OverviewPath}`,
    pathMatch: 'full',
  },
  {
    path: RoutePath.OverviewPath,
    loadChildren: () =>
      import('./feature/overview/overview.module').then(
        (m) => m.OverviewModule
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
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
