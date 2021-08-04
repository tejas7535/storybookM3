import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = 'app',
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    loadChildren: async () =>
      import('./home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full',
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
