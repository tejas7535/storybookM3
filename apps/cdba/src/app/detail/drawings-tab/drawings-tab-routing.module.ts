import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawingsTabComponent } from './drawings-tab.component';

const routes: Routes = [{ path: '', component: DrawingsTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrawingsTabRoutingModule {}
