import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './../app/app.component';

export enum RoutePath {
  BasePath = 'app',
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    component: AppComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: RoutePath.BasePath,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
