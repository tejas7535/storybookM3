import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutePath } from './app-route-path.enum';
import { prodGuard } from './shared/guards';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    children: [
      {
        path: AppRoutePath.BasePath,
        redirectTo: AppRoutePath.OverviewPath,
        pathMatch: 'full',
      },
      {
        path: AppRoutePath.OverviewPath,
        loadChildren: () =>
          import('./overview/overview.module').then((m) => m.OverviewModule),
      },
      {
        path: AppRoutePath.DrillDownPath,
        loadChildren: () =>
          import('./organizational-view/organizational-view.module').then(
            (m) => m.OrganizationalViewModule
          ),
      },
      {
        path: AppRoutePath.LossOfSkillPath,
        loadChildren: () =>
          import('./loss-of-skill/loss-of-skill.module').then(
            (m) => m.LossOfSkillModule
          ),
      },
      {
        path: AppRoutePath.ReasonsForLeavingPath,
        loadChildren: () =>
          import(
            './reasons-and-counter-measures/reasons-and-counter-measures.module'
          ).then((m) => m.ReasonsAndCounterMeasuresModule),
        canActivate: [prodGuard],
      },
      {
        path: AppRoutePath.FluctuationAnalyticsPath,
        loadChildren: () =>
          import('./attrition-analytics/attrition-analytics.module').then(
            (m) => m.AttritionAnalyticsModule
          ),
      },
    ],
  },
  {
    path: AppRoutePath.ForbiddenPath,
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  },
  {
    path: AppRoutePath.LegalPath,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
