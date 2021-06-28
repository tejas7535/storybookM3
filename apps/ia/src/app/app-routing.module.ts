import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutePath } from './app-route-path.enum';

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
        loadChildren: async () =>
          import('./overview/overview.module').then((m) => m.OverviewModule),
      },
      {
        path: AppRoutePath.OrganizationalView,
        loadChildren: async () =>
          import('./organizational-view/organizational-view.module').then(
            (m) => m.OrganizationalViewModule
          ),
      },
      {
        path: AppRoutePath.LossOfSkillPath,
        loadChildren: async () =>
          import('./loss-of-skills/loss-of-skills.module').then(
            (m) => m.LossOfSkillsModule
          ),
      },
    ],
  },
  {
    path: AppRoutePath.Forbidden,
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  },
  {
    path: '**',
    loadChildren: async () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
