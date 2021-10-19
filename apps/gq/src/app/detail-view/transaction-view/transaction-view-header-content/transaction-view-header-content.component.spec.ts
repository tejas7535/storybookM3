import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { TransactionViewHeaderContentComponent } from './transaction-view-header-content.component';

describe('HeaderContentComponent', () => {
  let component: TransactionViewHeaderContentComponent;
  let spectator: Spectator<TransactionViewHeaderContentComponent>;

  const createComponent = createComponentFactory({
    component: TransactionViewHeaderContentComponent,
    imports: [provideTranslocoTestingModule({}), SharedPipesModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
