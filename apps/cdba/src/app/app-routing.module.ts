import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = '',
  SearchPath = 'search',
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.SearchPath}`,
    pathMatch: 'full',
  },
  {
    path: RoutePath.SearchPath,
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
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
    RouterModule.forRoot(appRoutePaths, {
      useHash: true,
      initialNavigation: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
