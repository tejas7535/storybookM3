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
    loadChildren: async () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: `${RoutePath.HomePath}/:step/:id/:language/:separator/:head/:iframe`,
    loadChildren: async () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.HomePath}`,
    pathMatch: 'prefix',
  },
  {
    path: RoutePath.HomePath,
    loadChildren: async () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },

  {
    path: '**',
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
