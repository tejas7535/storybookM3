import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MACRoutes } from '@mac/shared/models';

import { OverviewComponent } from './overview.component';

const routes: MACRoutes = [
  {
    path: '',
    component: OverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewRoutingModule {}
