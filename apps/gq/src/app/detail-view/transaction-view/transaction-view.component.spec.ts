import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CaseHeaderModule } from '../../shared/header/case-header/case-header.module';
import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { ComparableTransactionsModule } from './comparable-transactions/comparable-transactions.module';
import { TransactionViewHeaderContentModule } from './transaction-view-header-content/transaction-view-header-content.module';
import { TransactionViewComponent } from './transaction-view.component';
import { TransparencyGraphModule } from './transparency-graph/transparency-graph.module';

describe('TransactionViewComponent', () => {
  let component: TransactionViewComponent;
  let spectator: Spectator<TransactionViewComponent>;

  const createComponent = createComponentFactory({
    component: TransactionViewComponent,
    imports: [
      ComparableTransactionsModule,
      CaseHeaderModule,
      TransparencyGraphModule,
      MatCardModule,
      LoadingSpinnerModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
      TransactionViewHeaderContentModule,
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
