import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BomCompareTabComponent } from './bom-compare-tab.component';

const routes: Routes = [{ path: '', component: BomCompareTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BomCompareTabRoutingModule {}
