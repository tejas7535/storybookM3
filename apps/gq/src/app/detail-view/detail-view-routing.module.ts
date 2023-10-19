import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComparableTransactionsGuard } from '@gq/core/guards';

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
    canActivateChild: [ComparableTransactionsGuard],
  },
  {
    path: DetailRoutePath.SapPath,
    loadChildren: () =>
      import('./sap-view/sap-view.module').then((m) => m.SapViewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailViewRoutingModule {}
