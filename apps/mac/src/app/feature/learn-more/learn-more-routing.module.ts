import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MACRoutes } from '@mac/shared/models';

import { LearnMoreResolver } from './resolver/learn-more.resolver';

const routes: MACRoutes = [
  {
    // path: 'hardness-converter',
    path: ':id',
    loadComponent: () =>
      import('./learn-more.component').then((m) => m.LearnMoreComponent),
    resolve: {
      data: LearnMoreResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearnMoreRoutingModule {}
