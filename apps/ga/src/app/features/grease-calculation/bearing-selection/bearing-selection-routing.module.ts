import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BearingSelectionComponent } from './bearing-selection.component';

const routes: Routes = [
  {
    path: '',
    component: BearingSelectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BearingSelectionRoutingModule {}
