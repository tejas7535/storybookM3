import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@schaeffler/shared/empty-states';

import { ExtensiondetailComponent } from './home/extension/extensiondetail/extensiondetail.component';
import { HomeComponent } from './home/home.component';

export enum RoutePath {
  BasePath = '',
  HomePath = 'home',
  ExtensiondetailPath = 'extension/:name',
  PageNotFoundPath = 'page-not-found',
  ExtensionPath = 'extension/:name'
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
    path: RoutePath.ExtensiondetailPath,
    component: ExtensiondetailComponent
  },
  {
    path: RoutePath.ExtensionPath,
    component: PageNotFoundComponent
  },

  { path: '**', redirectTo: `/${RoutePath.PageNotFoundPath}` }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
