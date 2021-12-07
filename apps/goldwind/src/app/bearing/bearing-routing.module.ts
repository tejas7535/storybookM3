import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BearingComponent } from './bearing.component';
import { BearingRoutePath } from './bearing-route-path.enum';

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
            loadChildren: async () =>
              import('./condition-monitoring/condition-monitoring.module').then(
                (m) => m.ConditionMonitoringModule
              ),
          },
          {
            path: BearingRoutePath.LoadAssessmentPath,
            loadChildren: async () =>
              import('./load-assessment/load-assessment.module').then(
                (m) => m.LoadAssessmentModule
              ),
          },
          {
            path: BearingRoutePath.DataViewPath,
            loadChildren: async () =>
              import('./data-view/data-view.module').then(
                (m) => m.DataViewModule
              ),
          },
          {
            path: BearingRoutePath.MaintenanceAsseesmentPath,
            loadChildren: async () =>
              import(
                './maintenance-assessment/maintenance-assessment.module'
              ).then((m) => m.MaintenanceAssessmentModule),
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
