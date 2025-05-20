import { HttpClient } from '@angular/common/http';

import { of, take, throwError } from 'rxjs';

import { Stub } from '../../shared/test/stub.class';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let http: HttpClient;

  beforeEach(() => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue('USD');

    service = Stub.get<CurrencyService>({
      component: CurrencyService,
    });

    http = service['http'];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentCurrency', () => {
    it('should return the current currency as an observable', (done) => {
      service
        .getCurrentCurrency()
        .pipe(take(1))
        .subscribe((currency) => {
          expect(currency).toBe('USD');
          done();
        });
    });
  });

  describe('getAvailableCurrencies', () => {
    it('should return the available currencies as an observable', (done) => {
      jest.spyOn(http, 'get').mockReturnValue(of(['USD', 'EUR']));
      service['fetchAvailableCurrencies']();

      service
        .getAvailableCurrencies()
        .pipe(take(1))
        .subscribe((currencies) => {
          expect(currencies).toEqual(['USD', 'EUR']);
          done();
        });
    });
  });

  describe('setCurrentCurrency', () => {
    const original = globalThis.location;
    let reloadSpy: jest.SpyInstance;

    beforeEach(() => {
      Object.defineProperty(globalThis, 'location', {
        configurable: true,
        writable: true,
        value: {
          reload: jest.fn(),
        },
      });

      reloadSpy = jest
        .spyOn(globalThis.location, 'reload')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      reloadSpy.mockRestore();
    });

    afterAll(() => {
      globalThis.location = original;
    });

    it('should set the current currency and reload the page if the currency is valid', () => {
      jest.spyOn(localStorage, 'setItem');
      jest
        .spyOn(service['availableCurrencies'], 'getValue')
        .mockReturnValue(['USD', 'EUR']);

      service.setCurrentCurrency('EUR');

      expect(localStorage.setItem).toHaveBeenCalledWith('currency', 'EUR');
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should throw an error if the currency is invalid', () => {
      jest
        .spyOn(service['availableCurrencies'], 'getValue')
        .mockReturnValue(['EUR']);
      expect(() => service.setCurrentCurrency('INVALID')).toThrow(
        'Saving currency failed.'
      );
    });

    it('should not reload the page if the currency is already set', () => {
      jest.spyOn(service['currentCurrency'], 'getValue').mockReturnValue('EUR');

      service.setCurrentCurrency('EUR');

      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });

  describe('fetchAvailableCurrencies', () => {
    it('should fetch available currencies and update the BehaviorSubject', () => {
      const mockCurrencies = ['USD', 'EUR'];
      jest.spyOn(http, 'get').mockReturnValue(of(mockCurrencies));
      const nextSpy = jest.spyOn(service['availableCurrencies'], 'next');

      service['fetchAvailableCurrencies']();

      expect(http.get).toHaveBeenCalledWith('api/info/currencies');
      expect(nextSpy).toHaveBeenCalledWith(mockCurrencies);
    });

    it('should set the default currency if the API call fails', () => {
      jest
        .spyOn(http, 'get')
        .mockReturnValue(throwError(() => new Error('API error')));
      const nextSpy = jest.spyOn(service['availableCurrencies'], 'next');

      service['fetchAvailableCurrencies']();

      expect(nextSpy).toHaveBeenCalledWith(['EUR']);
    });
  });
});
