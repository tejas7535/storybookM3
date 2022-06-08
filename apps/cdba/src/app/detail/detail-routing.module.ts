import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BasicRoleGuard, PricingRoleGuard } from '../core/auth';
import { DetailComponent } from './detail.component';
import { DetailRoutePath } from './detail-route-path.enum';

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
        canActivateChild: [BasicRoleGuard, PricingRoleGuard],
      },
      {
        path: DetailRoutePath.CalculationsPath,
        loadChildren: () =>
          import('./calculations-tab/calculations-tab.module').then(
            (m) => m.CalculationsTabModule
          ),
        canActivateChild: [BasicRoleGuard, PricingRoleGuard],
      },
      {
        path: '',
        redirectTo: DetailRoutePath.DetailsPath,
        pathMatch: 'full',
      },
      {
        path: '**',
        loadChildren: () =>
          import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRoutingModule {}
