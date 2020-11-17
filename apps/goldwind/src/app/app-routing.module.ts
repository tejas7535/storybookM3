import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutePath } from './app-route-path.enum';
import { RoleGuard } from './core/guards/role.guard';

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
    canActivate: [RoleGuard],
  },
  {
    path: AppRoutePath.BearingPath,
    loadChildren: () =>
      import('./bearing/bearing.module').then((m) => m.BearingModule),
    canActivate: [RoleGuard],
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
