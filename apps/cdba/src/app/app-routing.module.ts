import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutePath } from './app-route-path.enum';
import { RoleGuard } from './core/guards';
import { FORBIDDEN_ACTION } from './shared/constants';

export const appRoutes: Routes = [
  {
    path: AppRoutePath.BasePath,
    redirectTo: `/${AppRoutePath.SearchPath}`,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.SearchPath,
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
    canActivateChild: [RoleGuard],
  },
  {
    path: AppRoutePath.ForbiddenPath,
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then((m) => m.ForbiddenModule),
    data: {
      action: encodeURI(FORBIDDEN_ACTION),
    },
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      initialNavigation: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
