/* eslint-disable @nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalRoute } from '@schaeffler/legal-pages';

export enum RoutePath {
  BasePath = '',
  HomePath = 'app',
  LegalPath = 'legal',
}

export const appRoutePaths: Routes = [
  {
    path: LegalRoute,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: `${RoutePath.HomePath}/:step/:id/:language/:separator/:head/:iframe`,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.HomePath}`,
    pathMatch: 'full',
  },
  {
    path: RoutePath.HomePath,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
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
