import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = '',
  HomePath = 'app',
}

export const appRoutePaths: Routes = [
  {
    path: `${RoutePath.HomePath}/:step/:id/:language/:seperator/:head/:iframe`,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.HomePath}`,
    pathMatch: 'prefix',
  },
  {
    path: `${RoutePath.HomePath}`,
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
