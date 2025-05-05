import { signal } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { of, throwError } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { AppRoutePath, AppRouteValue } from '../../../app.routes.enum';
import { Region } from '../../../feature/global-selection/model';
import { CurrencyService } from '../../../feature/info/currency.service';
import { UserSettingsKey } from '../../models/user-settings.model';
import { Stub } from '../../test/stub.class';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  const startPageSignal = signal<AppRouteValue>(null);
  const regionSignal = signal<Region>(null);

  beforeEach(() => {
    component = Stub.getForEffect({
      component: UserSettingsComponent,
      providers: [
        // we need it here, can't be removed!
        MockProvider(CurrencyService, Stub.getCurrencyService(), 'useValue'),
        Stub.getUserServiceProvider({
          filterVisibleRoutes: [
            {
              path: startPageSignal(),
              data: {
                allowedRegions: [regionSignal()],
                titles: ['title', 'title 2'],
              },
            },
          ],
          startPage: startPageSignal,
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have a start-page selected initially', () => {
    expect(component['startPageControl'].getRawValue()).toBeNull();
  });

  describe('onCurrencySelectionChange', () => {
    it('should call setCurrentCurrency when onCurrencySelectionChange is called with a valid currency', () => {
      const currency = { id: 'USD', text: 'USD' };
      const setCurrentCurrencySpy = jest.spyOn(
        component['currencyService'],
        'setCurrentCurrency'
      );

      component['onCurrencySelectionChange'](currency);

      expect(setCurrentCurrencySpy).toHaveBeenCalledWith('USD');
    });

    it('should not call setCurrentCurrency when onCurrencySelectionChange is called with null', () => {
      const setCurrentCurrencySpy = jest.spyOn(
        component['currencyService'],
        'setCurrentCurrency'
      );

      component['onCurrencySelectionChange'](null);

      expect(setCurrentCurrencySpy).not.toHaveBeenCalled();
    });
  });

  describe('onStartPageSelectionChange', () => {
    it('should call updateUserSettings with the correct parameters when onStartPageSelectionChange is called', () => {
      const event = {
        value: AppRoutePath.AlertRuleManagementPage,
      } as MatSelectChange;
      const updateUserSettingsSpy = jest.spyOn(
        component['userService'],
        'updateUserSettings'
      );

      component['onStartPageSelectionChange'](event);

      expect(updateUserSettingsSpy).toHaveBeenCalledWith(
        UserSettingsKey.StartPage,
        AppRoutePath.AlertRuleManagementPage
      );
    });
  });

  describe('ngOnInit', () => {
    it('should set the current currency on the currency control', () => {
      const currentCurrency = 'USD';
      jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of(currentCurrency));
      const setValueSpy = jest.spyOn(component['currencyControl'], 'setValue');

      component.ngOnInit();

      expect(setValueSpy).toHaveBeenCalledWith({
        id: currentCurrency,
        text: currentCurrency,
      });
    });

    it('should set the available currencies', () => {
      const availableCurrencies = ['USD', 'EUR'];
      jest
        .spyOn(component['currencyService'], 'getAvailableCurrencies')
        .mockReturnValue(of(availableCurrencies));

      component.ngOnInit();

      expect(component['availableCurrencies']).toEqual([
        { id: 'USD', text: 'USD' },
        { id: 'EUR', text: 'EUR' },
      ]);
    });

    it('should call getCurrentCurrency and getAvailableCurrencies on the currencyService', () => {
      const getCurrentCurrencySpy = jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(of('USD'));
      const getAvailableCurrenciesSpy = jest
        .spyOn(component['currencyService'], 'getAvailableCurrencies')
        .mockReturnValue(of(['USD', 'EUR']));

      component.ngOnInit();

      expect(getCurrentCurrencySpy).toHaveBeenCalled();
      expect(getAvailableCurrenciesSpy).toHaveBeenCalled();
    });

    it('should handle errors from getCurrentCurrency gracefully', () => {
      jest
        .spyOn(component['currencyService'], 'getCurrentCurrency')
        .mockReturnValue(throwError(() => new Error('Error')));
      const setValueSpy = jest.spyOn(component['currencyControl'], 'setValue');

      component.ngOnInit();

      expect(setValueSpy).not.toHaveBeenCalled();
    });

    it('should handle errors from getAvailableCurrencies gracefully', () => {
      jest
        .spyOn(component['currencyService'], 'getAvailableCurrencies')
        .mockReturnValue(throwError(() => new Error('Error')));

      component.ngOnInit();

      expect(component['availableCurrencies']).toEqual([]);
    });
  });

  describe('constructor', () => {
    it('should set the startPageControl value to the userService startPage', () => {
      const startPage = AppRoutePath.AlertRuleManagementPage;
      jest
        .spyOn(component['userService'], 'userSettings')
        .mockReturnValue({ startPage } as any);
      const setValueSpy = jest.spyOn(component['startPageControl'], 'setValue');

      Stub.detectChanges();

      expect(setValueSpy).toHaveBeenCalledWith(startPage);
    });

    it('should show the current localization in the tooltip', () => {
      const testLocale = 'en-EN';
      const testDate = '02.05.2025';
      const testNumber = '2,893.32';

      jest.replaceProperty(
        component['translocoLocaleService'],
        'localeChanges$',
        of(testLocale)
      );
      const localizeDateSpy = jest
        .spyOn(component['translocoLocaleService'], 'localizeDate')
        .mockReturnValue(testDate);

      const localizeNumberSpy = jest
        .spyOn(component['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue(testNumber);

      const translateSpy = jest.spyOn(
        component['translocoService'],
        'translate'
      );
      Stub.detectChanges();
      expect(localizeDateSpy).toHaveBeenCalledWith(
        expect.any(Date),
        testLocale,
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      );
      expect(localizeNumberSpy).toHaveBeenCalledWith(
        2893.32,
        'decimal',
        testLocale
      );
      expect(translateSpy).toHaveBeenCalledWith('drawer.localization-tooltip', {
        date: testDate,
        number: testNumber,
      });
    });
  });
});
