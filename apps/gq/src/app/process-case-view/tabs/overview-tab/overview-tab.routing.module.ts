import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewTabComponent } from './overview-tab.component';

const routes: Routes = [{ path: '', component: OverviewTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewTabRoutingModule {}
