import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let spectator: SpectatorService<CurrencyService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: CurrencyService,
    imports: [],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrencies', () => {
    test('should call', () => {
      service.getCurrencies().subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service.PATH_CURRENCIES}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });

  describe('getExchangeRateForCurrency', () => {
    test('should call', () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      service
        .getExchangeRateForCurrency(fromCurrency, toCurrency)
        .subscribe((res) => expect(res).toBeTruthy());

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${service.PATH_CURRENCIES}/${fromCurrency}/exchangeRates/${toCurrency}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
    });
  });
});
