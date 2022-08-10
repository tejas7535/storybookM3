import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AvailabityGuard } from '@mac/core/guards';
import { MACRoutes } from '@mac/shared/models';

import { LifetimePredictorComponent } from './lifetime-predictor.component';

const basePath = 'lifetime-predictor';

export enum LTPRoutePaths {
  BasePath = '',
  Maintenance = 'maintenance',
}

const routes: MACRoutes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AvailabityGuard],
    component: LifetimePredictorComponent,
    data: {
      availabilityCheck: {
        basePath,
        path: LTPRoutePaths.BasePath,
        availabilityCheckUrl: '/lifetime-predictor/ml-prediction/api/healthz',
        isEmptyState: false,
      },
    },
  },
  {
    path: LTPRoutePaths.Maintenance,
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.MaintenanceModule),
    canActivate: [AvailabityGuard],
    data: {
      availabilityCheck: {
        basePath,
        path: LTPRoutePaths.BasePath,
        availabilityCheckUrl: '/lifetime-predictor/ml-prediction/api/healthz',
        isEmptyState: true,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LifetimePredictorRoutingModule {}
