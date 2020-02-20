import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResetFilterComponent } from './reset-filter.component';

export enum RoutePath {
  PageNotFoundPath = 'page-not-found'
}

const routes: Routes = [
  {
    path: '',
    component: ResetFilterComponent
  },
  { path: '**', redirectTo: `/${RoutePath.PageNotFoundPath}` }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetFilterRoutingModule {}
