import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = '',
  RefTypePath = 'ref-type'
}

export const appRoutePaths: Routes = [
  {
    path: RoutePath.BasePath,
    redirectTo: `/${RoutePath.RefTypePath}`,
    pathMatch: 'full'
  },
  {
    path: RoutePath.RefTypePath,
    loadChildren: () =>
      import('./ref-type/ref-type.module').then(m => m.RefTypeModule)
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(m => m.PageNotFoundModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutePaths, {
      useHash: true,
      initialNavigation: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
