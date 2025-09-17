import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RfqItemsTabGuard } from '@gq/core/guards/rfq-items-tab.guard';

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
          import('./tabs/single-quotes-tab/single-quotes-tab.routes').then(
            (m) => m.routes
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
        path: ProcessCaseRoutePath.RfqItemsPath,
        loadComponent: () =>
          import('./tabs/rfq-items-tab/rfq-items-tab.component').then(
            (m) => m.RfqItemsTabComponent
          ),
        canActivate: [RfqItemsTabGuard],
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
