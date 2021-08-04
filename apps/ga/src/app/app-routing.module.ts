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
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
