/* eslint-disable @nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalRoute } from '@schaeffler/legal-pages';

import { LanguageGuard } from './guards/language.guard';

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
    canActivate: [LanguageGuard],
  },
  {
    path: `${RoutePath.HomePath}/:step/:id/:language/:separator/:head/:iframe`,
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [LanguageGuard],
  },
  {
    path: RoutePath.HomePath,
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [LanguageGuard],
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
