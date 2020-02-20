import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = '',
  HomePath = 'home',
  PageNotFoundPath = 'page-not-found',
  ExtensionPath = 'home/:name',
  ExtensionsPath = 'extensions'
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.HomePath}`,
    pathMatch: 'full'
  },
  {
    path: RoutePath.HomePath,
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: RoutePath.ExtensionsPath,
    loadChildren: () =>
      import('./features/extensions/extensions.module').then(
        m => m.ExtensionsModule
      )
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(m => m.PageNotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
