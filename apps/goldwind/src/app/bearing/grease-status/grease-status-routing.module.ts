import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GreaseStatusComponent } from './grease-status.component';

const routes: Routes = [{ path: '', component: GreaseStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreaseStatusRoutingModule {}
