import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { TransactionViewComponent } from './transaction-view.component';

describe('TransactionViewComponent', () => {
  let component: TransactionViewComponent;
  let spectator: Spectator<TransactionViewComponent>;

  const createComponent = createComponentFactory({
    component: TransactionViewComponent,
    imports: [UnderConstructionModule, provideTranslocoTestingModule({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
