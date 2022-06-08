import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BasicRoleGuard, PricingRoleGuard } from '../core/auth';
import { CompareComponent } from './compare.component';
import { CompareRoutePath } from './compare-route-path.enum';

const routes: Routes = [
  {
    path: '',
    component: CompareComponent,
    children: [
      {
        path: CompareRoutePath.DetailsPath,
        loadChildren: () =>
          import('./details-tab/details-tab.module').then(
            (m) => m.DetailsTabModule
          ),
      },
      {
        path: CompareRoutePath.BomPath,
        loadChildren: () =>
          import('./bom-compare-tab/bom-compare-tab.module').then(
            (m) => m.BomCompareTabModule
          ),
        canActivateChild: [BasicRoleGuard, PricingRoleGuard],
      },
      {
        path: '',
        redirectTo: CompareRoutePath.BomPath,
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
export class CompareRoutingModule {}
