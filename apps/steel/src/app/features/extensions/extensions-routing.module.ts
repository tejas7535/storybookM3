import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  // RefreshExtPath = 'refresh-ext',
  ResetFilterPath = 'reset-filter',
  PageNotFoundPath = 'page-not-found'
}

const routes: Routes = [
  // {
  //   path: RoutePath.RefreshExtPath,
  //   loadChildren: () =>
  //     import('./refresh-ext/refresh-ext.module').then(m => m.RefreshExtModule)
  // },
  {
    path: RoutePath.ResetFilterPath,
    loadChildren: () =>
      import('./reset-filter/reset-filter.module').then(
        m => m.ResetFilterModule
      )
  },
  { path: '**', redirectTo: `/${RoutePath.PageNotFoundPath}` }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtensionsRoutingModule {}
