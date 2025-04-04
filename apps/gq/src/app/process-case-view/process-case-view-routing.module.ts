import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OpenItemsTabGuard } from '@gq/core/guards/open-items-tab.guard';

import { ProcessCaseRoutePath } from './process-case-route-path.enum';
import { ProcessCaseViewComponent } from './process-case-view.component';

const routes: Routes = [
  {
    path: ProcessCaseRoutePath.BasePath,
    component: ProcessCaseViewComponent,
    children: [
      {
        path: ProcessCaseRoutePath.SingleQuotesPath,
        loadChildren: () =>
          import('./tabs/single-quotes-tab/single-quotes-tab.module').then(
            (m) => m.SingleQuotesTabModule
          ),
      },
      {
        path: ProcessCaseRoutePath.CustomerDetailsPath,
        loadChildren: () =>
          import(
            './tabs/customer-details-tab/customer-details-tab.module'
          ).then((m) => m.CustomerDetailsTabModule),
      },
      {
        path: ProcessCaseRoutePath.OverviewPath,
        loadChildren: () =>
          import('./tabs/overview-tab/overview-tab.module').then(
            (m) => m.OverviewTabModule
          ),
      },
      {
        path: ProcessCaseRoutePath.OpenItemsPath,
        loadComponent: () =>
          import('./tabs/open-items-tab/open-items-tab.component').then(
            (m) => m.OpenItemsTabComponent
          ),
        canActivate: [OpenItemsTabGuard],
      },
      {
        path: ProcessCaseRoutePath.BasePath,
        redirectTo: 'single-quotes',
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
export class ProcessCaseViewRoutingModule {}
