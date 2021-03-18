import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalesTableComponent } from './sales-table/sales-table.component';

const routes: Routes = [
  {
    path: '',
    component: SalesTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesSummaryRoutingModule {}
