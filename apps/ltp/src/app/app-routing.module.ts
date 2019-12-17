import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  PageNotFoundComponent,
  PageNotFoundModule
} from '@schaeffler/shared/empty-states';

import { SignedoutComponent } from './shared/components/signedout/signedout.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

import { AuthGuard } from './core/guards/auth.guard';

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
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), PageNotFoundModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
