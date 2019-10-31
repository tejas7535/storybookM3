import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@schaeffler/shared/empty-states';

import { HomeComponent } from './home/home.component';

export enum RoutePath {
  BasePath = '',
  HomePath = 'home',
  PageNotFoundPath = 'page-not-found'
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.HomePath}`,
    pathMatch: 'full'
  },
  {
    path: RoutePath.HomePath,
    component: HomeComponent
  },
  {
    path: RoutePath.PageNotFoundPath,
    component: PageNotFoundComponent
  },
  { path: '**', redirectTo: `/${RoutePath.PageNotFoundPath}` }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutePaths, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
