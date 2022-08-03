import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LearnMoreResolver } from './resolver/learn-more.resolver';

const routes: Routes = [
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
