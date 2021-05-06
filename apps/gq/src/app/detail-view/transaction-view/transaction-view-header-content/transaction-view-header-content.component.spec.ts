import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../shared/info-icon/info-icon.module';
import { TransactionViewHeaderContentComponent } from './transaction-view-header-content.component';

describe('HeaderContentComponent', () => {
  let component: TransactionViewHeaderContentComponent;
  let spectator: Spectator<TransactionViewHeaderContentComponent>;

  const createComponent = createComponentFactory({
    component: TransactionViewHeaderContentComponent,
    imports: [provideTranslocoTestingModule({}), InfoIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
