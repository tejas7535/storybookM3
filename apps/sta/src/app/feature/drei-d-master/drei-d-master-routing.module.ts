import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/auth.guard';
import { DreiDMasterComponent } from './drei-d-master.component';

const routes: Routes = [
  {
    path: '',
    component: DreiDMasterComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DreiDMasterRoutingModule {}
