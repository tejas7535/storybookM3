import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AvailabityGuard } from '@mac/core/guards';
import { MACRoutes } from '@mac/shared/models';

import { HardnessConverterComponent } from './hardness-converter.component';

const basePath = 'hardness-converter';

export enum HCRoutePaths {
  BasePath = '',
  Maintenance = 'maintenance',
}

const routes: MACRoutes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [AvailabityGuard],
    component: HardnessConverterComponent,
    data: {
      availabilityCheck: {
        basePath,
        path: HCRoutePaths.BasePath,
        availabilityCheckUrl: '/hardness-conversion/api/healthz',
        isEmptyState: false,
      },
    },
  },
  {
    path: HCRoutePaths.Maintenance,
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.MaintenanceModule),
    canActivate: [AvailabityGuard],
    data: {
      availabilityCheck: {
        basePath,
        path: HCRoutePaths.BasePath,
        availabilityCheckUrl: '/hardness-conversion/api/healthz',
        isEmptyState: true,
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HardnessConverterRoutingModule {}
