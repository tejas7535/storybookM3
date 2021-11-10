import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailRoutePath } from './detail-route-path.enum';

const routes: Routes = [
  {
    path: DetailRoutePath.BasePath,
    loadChildren: async () =>
      import('./detail-view/detail-view.module').then(
        (m) => m.DetailViewModule
      ),
  },
  {
    path: DetailRoutePath.TransactionsPath,
    loadChildren: async () =>
      import('./transaction-view/transaction-view.module').then(
        (m) => m.TransactionViewModule
      ),
  },
  {
    path: DetailRoutePath.SapPath,
    loadChildren: async () =>
      import('./sap-view/sap-view.module').then((m) => m.SapViewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailViewRoutingModule {}
