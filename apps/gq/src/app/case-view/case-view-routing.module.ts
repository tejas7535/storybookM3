import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CaseViewComponent } from './case-view.component';

const routes: Routes = [
  {
    path: '',
    component: CaseViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseViewRoutingModule {}
