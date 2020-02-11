import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExtensiondetailComponent } from './extension/extensiondetail/extensiondetail.component';
import { HomeComponent } from './home.component';
import { OverviewComponent } from './overview/overview.component';

export enum RoutePath {
  HomePath = '',
  ExtensiondetailPath = ':name',
  PageNotFoundPath = 'page-not-found'
}

export const homeRoutePaths: Routes = [
  {
    path: RoutePath.HomePath,
    component: HomeComponent,
    children: [
      {
        path: RoutePath.HomePath,
        component: OverviewComponent
      },
      {
        path: RoutePath.ExtensiondetailPath,
        component: ExtensiondetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutePaths)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
