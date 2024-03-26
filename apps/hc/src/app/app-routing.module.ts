import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutePath } from './app-route-path.enum';
import { HardnessConverterComponent } from './components/hardness-converter/hardness-converter.component';
import { AvailabityGuard } from './core/guards/availability';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    pathMatch: 'full',
    canActivate: [AvailabityGuard],
    component: HardnessConverterComponent,
    data: {
      availabilityCheck: {
        path: AppRoutePath.BasePath,
        availabilityCheckUrl: '/hardness-conversion/api/healthz',
        isEmptyState: false,
      },
    },
  },
  {
    path: AppRoutePath.LearnMore,
    loadComponent: () =>
      import('./components/learn-more/learn-more.component').then(
        (m) => m.LearnMoreComponent
      ),
  },
  {
    path: AppRoutePath.LegalPath,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: AppRoutePath.Maintenance,
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.MaintenanceModule),
    canActivate: [AvailabityGuard],
    data: {
      availabilityCheck: {
        path: AppRoutePath.BasePath,
        availabilityCheckUrl: '/hardness-conversion/api/healthz',
        isEmptyState: true,
      },
    },
  },
  {
    path: '**',
    redirectTo: AppRoutePath.BasePath,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
