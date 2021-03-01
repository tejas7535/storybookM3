import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BearingRoutePath } from './bearing-route-path.enum';
import { BearingComponent } from './bearing.component';

const routes: Routes = [
  {
    path: `${BearingRoutePath.BasePath}:id`,
    component: BearingComponent,
    children: [
      {
        path: BearingRoutePath.BasePath,
        children: [
          {
            path: BearingRoutePath.BasePath,
            redirectTo: BearingRoutePath.ConditionMonitoringPath,
          },
          {
            path: BearingRoutePath.ConditionMonitoringPath,
            loadChildren: () =>
              import('./condition-monitoring/condition-monitoring.module').then(
                (m) => m.ConditionMonitoringModule
              ),
          },
          {
            path: BearingRoutePath.GreaseStatusPath,
            loadChildren: () =>
              import('./grease-status/grease-status.module').then(
                (m) => m.GreaseStatusModule
              ),
          },
          {
            path: BearingRoutePath.DataViewPath,
            loadChildren: () =>
              import('./data-view/data-view.module').then(
                (m) => m.DataViewModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BearingRoutingModule {}
