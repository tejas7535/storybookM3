import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BomTabComponent } from './bom-tab.component';

const routes: Routes = [{ path: '', component: BomTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BomTabRoutingModule {}
