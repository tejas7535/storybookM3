import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
