import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailRoutePath } from './detail-route-path.enum';
import { DetailComponent } from './detail.component';

const routes: Routes = [
  {
    path: '',
    component: DetailComponent,
    children: [
      {
        path: DetailRoutePath.DetailsPath,
        loadChildren: () =>
          import('./detail-tab/detail-tab.module').then(
            (m) => m.DetailTabModule
          ),
      },
      {
        path: DetailRoutePath.BomPath,
        loadChildren: () =>
          import('./bom-tab/bom-tab.module').then((m) => m.BomTabModule),
      },
      {
        path: DetailRoutePath.CalculationsPath,
        loadChildren: () =>
          import('./calculations-tab/calculations-tab.module').then(
            (m) => m.CalculationsTabModule
          ),
      },
      {
        path: DetailRoutePath.DrawingsPath,
        loadChildren: () =>
          import('./drawings-tab/drawings-tab.module').then(
            (m) => m.DrawingsTabModule
          ),
      },
      {
        path: '',
        redirectTo: DetailRoutePath.DetailsPath,
        pathMatch: 'full',
      },
      {
        path: '**',
        loadChildren: () =>
          import('@schaeffler/shared/empty-states').then(
            (m) => m.PageNotFoundModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRoutingModule {}
