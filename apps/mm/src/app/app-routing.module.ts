import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = '',
  HomePath = 'app',
  LegalPath = 'legal',
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.LegalPath,
    loadChildren: () =>
      import('./legal/legal.module').then((m) => m.LegalModule),
  },
  {
    path: `${RoutePath.HomePath}/:step/:id/:language/:separator/:head/:iframe`,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.HomePath}`,
    pathMatch: 'prefix',
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
