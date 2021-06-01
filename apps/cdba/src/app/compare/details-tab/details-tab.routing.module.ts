import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsTabComponent } from './details-tab.component';

const routes: Routes = [{ path: '', component: DetailsTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsTabRoutingModule {}
