import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompareRoutePath } from './compare-route-path.enum';
import { CompareComponent } from './compare.component';
import { authConfig, RoleGuard } from '../core/auth';

const routes: Routes = [
  {
    path: '',
    component: CompareComponent,
    children: [
      {
        path: CompareRoutePath.DetailsPath,
        loadChildren: async () =>
          import('./details-tab/details-tab.module').then(
            (m) => m.DetailsTabModule
          ),
      },
      {
        path: CompareRoutePath.BomPath,
        loadChildren: async () =>
          import('./bom-compare-tab/bom-compare-tab.module').then(
            (m) => m.BomCompareTabModule
          ),
        canActivateChild: [RoleGuard],
        data: {
          rolesWithAccess: authConfig.pricingRoles,
        },
      },
      {
        path: '',
        redirectTo: CompareRoutePath.BomPath,
        pathMatch: 'full',
      },
      {
        path: '**',
        loadChildren: async () =>
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
