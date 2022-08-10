import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AvailabityGuard } from '@mac/core/guards';
import { MaterialsSupplierDatabaseComponent } from '@mac/msd/materials-supplier-database.component';
import { MACRoutes } from '@mac/shared/models';

const basePath = 'materials-supplier-database';

export enum MSDRoutePaths {
  BasePath = '',
  MainTablePath = 'main-table',
  Maintenance = 'maintenance',
}

const routes: MACRoutes = [
  {
    path: MSDRoutePaths.BasePath,
    redirectTo: MSDRoutePaths.MainTablePath,
    pathMatch: 'full',
  },
  {
    path: MSDRoutePaths.BasePath,
    component: MaterialsSupplierDatabaseComponent,
    children: [
      {
        path: MSDRoutePaths.MainTablePath,
        loadChildren: () =>
          import('./main-table/main-table.module').then(
            (m) => m.MainTableModule
          ),
        data: {
          availabilityCheck: {
            basePath,
            path: MSDRoutePaths.MainTablePath,
            availabilityCheckUrl:
              '/materials-supplier-database/api/actuator/health',
            isEmptyState: false,
          },
        },
        canActivate: [AvailabityGuard],
      },
      {
        path: MSDRoutePaths.Maintenance,
        loadChildren: () =>
          import('@schaeffler/empty-states').then((m) => m.MaintenanceModule),
        data: {
          availabilityCheck: {
            basePath,
            path: MSDRoutePaths.MainTablePath,
            availabilityCheckUrl:
              '/materials-supplier-database/api/actuator/health',
            isEmptyState: true,
          },
        },
        canActivate: [AvailabityGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialsSupplierDatabaseRoutingModule {}
