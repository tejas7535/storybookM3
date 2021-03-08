import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompareRoutePath } from './compare-route-path.enum';
import { CompareComponent } from './compare.component';

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
          import('./bom-tab/bom-tab.module').then((m) => m.BomTabModule),
      },
      {
        path: '',
        redirectTo: CompareRoutePath.DetailsPath,
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
