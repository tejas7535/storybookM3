import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerViewComponent } from './customer-view.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerViewRoutingModule {}
