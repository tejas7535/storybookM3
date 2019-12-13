import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignedoutComponent } from './shared/components/signedout/signedout.component';

import { AuthGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

const authorized = {
  canActivate: [AuthGuard],
  data: {
    roles: ['lifetime_predictor_consumer'],
    unauthorized: {
      redirect: ['forbidden']
    }
  }
};

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'forbidden',
    component: UnauthorizedComponent
  },
  {
    path: 'signout',
    component: SignedoutComponent
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./feature/home/home.module').then(m => m.HomeModule),
    pathMatch: 'full',
    ...authorized
  }
  // {
  //   path: '**',
  //   redirectTo: `/${RoutePath.HomePath}`,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
