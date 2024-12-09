import { Subject } from 'rxjs';

import {
  Accessory,
  Lubricator,
  RecommendationResponse,
} from '@lsa/shared/models';
import { MediasCallbackResponse } from '@lsa/shared/models/price-availibility.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { PriceAvailabilityService } from './price-availability.service';
import { RestService } from './rest.service';

describe('PriceAvailabilityService', () => {
  let spectator: SpectatorService<PriceAvailabilityService>;
  let service: PriceAvailabilityService;
  const recommendation$ = new Subject<RecommendationResponse>();

  const createService = createServiceFactory({
    service: PriceAvailabilityService,
    providers: [
      {
        provide: RestService,
        useValue: {
          recommendation$,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when isRecommendationResponse is called', () => {
    const response: RecommendationResponse = {
      lubricators: {
        minimumRequiredLubricator: {
          bundle: [
            {
              pim_code: '123',
              qty: 5,
            } as Partial<Accessory> as Accessory,
            {
              pim_code: '555',
              qty: 0,
            } as Partial<Accessory> as Accessory,
            {
              pim_code: '666',
              qty: 0,
            } as Partial<Accessory> as Accessory,
          ],
        } as Partial<Lubricator> as Lubricator,
        recommendedLubricator: {
          bundle: [
            {
              pim_code: '123',
              qty: 5,
            } as Partial<Accessory> as Accessory,
            {
              pim_code: '456',
              qty: 1,
            } as Partial<Accessory> as Accessory,
            {
              pim_code: '666',
              qty: 0,
            } as Partial<Accessory> as Accessory,
          ],
        } as Partial<Lubricator> as Lubricator,
      },
    } as Partial<RecommendationResponse> as RecommendationResponse;

    it('should subscribe to recommendation$ and handle response', () => {
      const handleRecommendationResponseSpy = jest.spyOn(
        service as any,
        'handleRecommendationResponse'
      );

      recommendation$.next(response);

      expect(handleRecommendationResponseSpy).toHaveBeenCalledWith(response);
    });

    it('should handle price and availability request with unique values for accessories with quantity', () => {
      const fetchPriceAndAvailabilitySpy = jest.spyOn(
        service as any,
        'fetchPriceAndAvailability'
      );

      recommendation$.next(response);

      expect(fetchPriceAndAvailabilitySpy).toHaveBeenCalledWith(['123', '456']);
    });

    it('should handle price and availability request with unique values for accessories without quantity', () => {
      const fetchPriceAndAvailabilitySpy = jest.spyOn(
        service as any,
        'fetchPriceAndAvailability'
      );

      recommendation$.next(response);

      expect(fetchPriceAndAvailabilitySpy).toHaveBeenCalledWith(['555', '666']);
    });

    it('should fetch price and availability', (done) => {
      const pimIds = ['123', '456'];
      const mockResponse: MediasCallbackResponse = {
        items: {
          '123': {
            available: true,
            price: 100,
            currency: 'USD',
          },
          '456': {
            available: false,
            currency: 'USD',
          },
        },
      };

      service.priceAndAvailabilityRequest$.subscribe((event) => {
        expect(event.details.payload.pimIds).toEqual(pimIds);
        event.callback(mockResponse);
      });

      service.priceAndAvailabilityResponse$.subscribe(
        (availabilityResponse) => {
          expect(availabilityResponse).toEqual(mockResponse);
          done();
        }
      );

      recommendation$.next(response);
    });
  });

  it('should complete destroyed$ subject on ngOnDestroy', () => {
    const destroyed$ = (service as any).destroyed$ as Subject<void>;
    const completeSpy = jest.spyOn(destroyed$, 'complete');

    service.ngOnDestroy();

    expect(completeSpy).toHaveBeenCalled();
  });
});
