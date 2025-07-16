import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { PriceAndAvailabilityService } from './price-and-availability.service';
import { CallbackData } from './types';

describe('PriceAndAvailabilityService', () => {
  let spectator: SpectatorService<PriceAndAvailabilityService>;
  let requestsSpy: jest.SpyInstance;

  const createService = createServiceFactory(PriceAndAvailabilityService);

  beforeEach(() => {
    spectator = createService();
    requestsSpy = jest.spyOn(spectator.service['requests$$'], 'next');
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should resolve requested IDs when the callback is triggered', (done) => {
    const result = spectator.service.fetchAvailabilityInfo(['123', '456']);
    const callback = requestsSpy.mock.calls[0][0].callback;

    const MOCK_RESPONSE: CallbackData = {
      items: {
        '123': {
          available: true,
          price: 123,
          currency: 'EUR',
        },
        '456': {
          available: false,
          price: 150,
          currency: 'EUR',
        },
      },
    };

    expect(requestsSpy).toHaveBeenCalled();

    result.subscribe((productData) => {
      expect(productData).toEqual(MOCK_RESPONSE);
      done();
    });

    callback(MOCK_RESPONSE);
  });
});
