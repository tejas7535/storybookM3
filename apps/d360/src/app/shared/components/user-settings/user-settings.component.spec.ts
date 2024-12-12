import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { CurrencyService } from '../../../feature/info/currency.service';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let spectator: Spectator<UserSettingsComponent>;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    providers: [
      mockProvider(CurrencyService, {
        getCurrentCurrency: jest.fn().mockReturnValue(of('EUR')),
        getAvailableCurrencies: jest.fn().mockReturnValue(of([])),
      }),
      mockProvider(TranslocoLocaleService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
