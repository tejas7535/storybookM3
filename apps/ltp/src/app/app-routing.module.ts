import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AppRoutePath } from './app-route-path.enum';
import { RoleGuard } from './core/guards/role.guard';
import { SignedoutComponent } from './shared/components/signedout/signedout.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

const authorized = {
  canActivateChild: [RoleGuard],
  data: {
    roles: [environment.accessRole],
    unauthorized: {
      redirect: [AppRoutePath.ForbiddenPath],
    },
  },
};

const routes: Routes = [
  {
    path: AppRoutePath.BasePath,
    redirectTo: AppRoutePath.HomePath,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.ForbiddenPath,
    component: UnauthorizedComponent,
  },
  {
    path: AppRoutePath.SignoutPath,
    component: SignedoutComponent,
  },
  {
    path: AppRoutePath.HomePath,
    loadChildren: () =>
      import('./feature/home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full',
    ...authorized,
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'disabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
