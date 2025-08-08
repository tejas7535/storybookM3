import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComparableTransactionsGuard } from '@gq/core/guards';
import { TransactionsModule } from '@gq/core/store/transactions/transactions.module';

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
    loadComponent: () =>
      import('./transaction-view/transaction-view.component').then(
        (m) => m.TransactionViewComponent
      ),
    loadChildren: () => TransactionsModule,
    canActivateChild: [ComparableTransactionsGuard],
  },
  {
    path: DetailRoutePath.SapPath,
    loadComponent: () =>
      import('./sap-view/sap-view.component').then((m) => m.SapViewComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailViewRoutingModule {}
