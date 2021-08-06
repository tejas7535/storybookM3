import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BearingComponent } from './bearing.component';

const routes: Routes = [
  {
    path: '',
    component: BearingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BearingRoutingModule {}
