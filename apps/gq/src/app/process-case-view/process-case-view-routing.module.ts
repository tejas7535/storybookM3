import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProcessCaseViewComponent } from './process-case-view.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessCaseViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessCaseViewRoutingModule {}
