/* eslint-disable @nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalRoute } from '@schaeffler/legal-pages';

import { LanguageGuard } from './guards/language.guard';

export enum RoutePath {
  HomePath = '',
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
    path: RoutePath.HomePath,
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [LanguageGuard],
  },

  {
    path: '**',
    redirectTo: RoutePath.HomePath,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
