import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AvailabityGuard } from '@mac/core/guards';
import { MACRoutes } from '@mac/shared/models';

import { AqmCalculatorComponent } from './aqm-calculator.component';

const basePath = 'aqm-calculator';

export enum AQMRoutePaths {
  BasePath = '',
  Maintenance = 'maintenance',
}

const routes: MACRoutes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AvailabityGuard],
    component: AqmCalculatorComponent,
    data: {
      availabilityCheck: {
        basePath,
        path: AQMRoutePaths.BasePath,
        availabilityCheckUrl: '/aqm-calculation/api/healthz',
        isEmptyState: false,
      },
    },
  },
  {
    path: AQMRoutePaths.Maintenance,
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.MaintenanceModule),
    canActivate: [AvailabityGuard],
    data: {
      availabilityCheck: {
        basePath,
        path: AQMRoutePaths.BasePath,
        availabilityCheckUrl: '/aqm-calculation/api/healthz',
        isEmptyState: true,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AqmCalculatorRoutingModule {}
