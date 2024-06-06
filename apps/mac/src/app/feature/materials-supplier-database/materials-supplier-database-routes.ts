import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { AvailabityGuard } from '@mac/core/guards';
import { MaterialsSupplierDatabaseComponent } from '@mac/msd/materials-supplier-database.component';
import { MACRoutes } from '@mac/shared/models';

import { MsdDialogService } from './services';
import {
  DataEffects,
  DialogEffects,
  QuickFilterEffects,
  reducers,
} from './store';

const basePath = 'materials-supplier-database';

export enum MSDRoutePaths {
  BasePath = '',
  MainTablePath = 'main-table',
  Maintenance = 'maintenance',
}

export const routes: MACRoutes = [
  {
    path: MSDRoutePaths.BasePath,
    redirectTo: MSDRoutePaths.MainTablePath,
    pathMatch: 'full',
  },
  {
    path: MSDRoutePaths.BasePath,
    component: MaterialsSupplierDatabaseComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: MSDRoutePaths.MainTablePath,
        loadComponent: () =>
          import('./main-table/main-table.component').then(
            (m) => m.MainTableComponent
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
    providers: [
      MsdDialogService,
      provideState('msd', reducers),
      provideEffects([DataEffects, DialogEffects, QuickFilterEffects]),
    ],
  },
];
