import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ComparableTransactionsComponent } from './comparable-transactions.component';

describe('ComparableTransactionsComponent', () => {
  let component: ComparableTransactionsComponent;
  let spectator: Spectator<ComparableTransactionsComponent>;

  const createComponent = createComponentFactory({
    component: ComparableTransactionsComponent,
    imports: [
      UnderConstructionModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
