import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailRoutePath } from './detail-route-path.enum';

const routes: Routes = [
  {
    path: DetailRoutePath.BasePath,
    loadChildren: () =>
      import('./detail-view/detail-view.module').then(
        (m) => m.DetailViewModule
      ),
  },
  {
    path: DetailRoutePath.TransactionsPath,
    loadChildren: () =>
      import('./transaction-view/transaction-view.module').then(
        (m) => m.TransactionViewModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailViewRoutingModule {}
