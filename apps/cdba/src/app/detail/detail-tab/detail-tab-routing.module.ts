import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailTabComponent } from './detail-tab.component';

const routes: Routes = [{ path: '', component: DetailTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailTabRoutingModule {}
