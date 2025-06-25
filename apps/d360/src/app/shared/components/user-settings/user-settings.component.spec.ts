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
        Stub.getStoreProvider(),
      ],
    });

    Stub.setInput('shell', { sidenavOpen: null });
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
    });

    it('should handle errors when localizing data', () => {
      const testLocale = 'en-EN';
      jest.replaceProperty(
        component['translocoLocaleService'],
        'localeChanges$',
        of(testLocale)
      );

      jest
        .spyOn(component['translocoLocaleService'], 'localizeDate')
        .mockImplementation(() => {
          throw new Error('Localization error');
        });

      // Should not throw when a localization error occurs
      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });
  });

  describe('availableFunctions', () => {
    it('should group routes by function category', () => {
      const routesMock = {
        salesSuite: [{ path: 'sales1' }, { path: 'sales2' }],
        demandSuite: [{ path: 'demand1' }],
        general: [{ path: 'general1' }],
      };

      jest
        .spyOn(component['userService'], 'filterVisibleRoutes')
        .mockImplementation((routes) => {
          switch (routes) {
            case component['appRoutes'].functions.salesSuite: {
              return routesMock.salesSuite as any[];
            }
            case component['appRoutes'].functions.demandSuite: {
              return routesMock.demandSuite as any[];
            }
            case component['appRoutes'].functions.general: {
              return routesMock.general as any[];
            }
            // No default
          }

          return [];
        });

      Stub.detectChanges();

      const result = component['availableFunctions']();
      expect(result.salesSuite).toEqual(routesMock.salesSuite);
      expect(result.demandSuite).toEqual(routesMock.demandSuite);
      expect(result.general.length).toEqual(2); // general routes + todos route
    });

    it('should include the todos route in the general category', () => {
      jest
        .spyOn(component['userService'], 'filterVisibleRoutes')
        .mockReturnValue([]);

      Stub.detectChanges();

      const result = component['availableFunctions']();
      expect(result.general).toContain(component['appRoutes'].todos);
    });
  });

  describe('form controls', () => {
    it('should initialize currencyControl and startPageControl with validators', () => {
      expect(component['currencyControl'].valid).toBeFalsy();
      expect(component['startPageControl'].valid).toBeFalsy();

      component['currencyControl'].setValue({ id: 'USD', text: 'USD' });
      component['startPageControl'].setValue(
        AppRoutePath.AlertRuleManagementPage
      );

      expect(component['currencyControl'].valid).toBeTruthy();
      expect(component['startPageControl'].valid).toBeTruthy();
    });

    it('should include both controls in the userSettingsForm', () => {
      expect(component['userSettingsForm'].contains('currency')).toBeTruthy();
      expect(component['userSettingsForm'].contains('startPage')).toBeTruthy();
    });
  });

  describe('localizationTooltip', () => {
    it('should initialize as null', () => {
      expect(component['localizationTooltip']()).toBeNull();
    });

    it('should update when locale changes', () => {
      const testLocale = 'en-EN';
      const tooltipText = 'drawer.localization-tooltip';

      jest.replaceProperty(
        component['translocoLocaleService'],
        'localeChanges$',
        of(testLocale)
      );

      component.ngOnInit();

      expect(component['localizationTooltip']()).toBe(tooltipText);
    });
  });

  describe('isAdmin', () => {
    it('should return false if backendRoles is null', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue(null);

      const result = component['isAdmin']();

      expect(result).toBe(false);
    });

    it('should return false if backendRoles is empty', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue([]);

      const result = component['isAdmin']();

      expect(result).toBe(false);
    });

    it('should return true if backendRoles includes multiple allowed roles', () => {
      jest
        .spyOn(component as any, 'backendRoles')
        .mockReturnValue(['admin', 'SD-D360_ADMIN']);

      expect(component['isAdmin']()).toBe(true);
    });
  });
});
