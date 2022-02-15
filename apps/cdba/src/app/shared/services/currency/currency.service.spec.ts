import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let spectator: SpectatorService<CurrencyService>;
  const createService = createServiceFactory(CurrencyService);

  beforeEach(() => (spectator = createService()));

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should return current currency', () => {
    expect(spectator.service.getCurrency()).toEqual('EUR');
  });
});
