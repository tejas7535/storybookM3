import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionViewComponent } from './transaction-view.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionViewRoutingModule {}
