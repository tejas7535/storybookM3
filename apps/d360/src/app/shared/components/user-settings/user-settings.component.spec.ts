import { signal } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { Observable, of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { CustomRoute } from '../../../app.routes';
import { AppRoutePath, AppRouteValue } from '../../../app.routes.enum';
import { Region } from '../../../feature/global-selection/model';
import { CurrencyService } from '../../../feature/info/currency.service';
import { UserService } from '../../services/user.service';
import { Stub } from '../../test/stub.class';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  const startPageSignal = signal<AppRouteValue>(null);
  const regionSignal = signal<Region>(null);
  let testPage: AppRouteValue;

  beforeEach(() => {
    testPage = AppRoutePath.TodoPage;

    component = Stub.getForEffect({
      component: UserSettingsComponent,
      providers: [
        MockProvider(CurrencyService, {
          getCurrentCurrency: jest.fn().mockReturnValue(of('EUR')),
          getAvailableCurrencies: jest.fn().mockReturnValue(of([])),
        }),
        MockProvider(
          UserService,
          {
            filterVisibleRoutes(): CustomRoute[] {
              return [
                {
                  path: startPageSignal(),
                  data: {
                    allowedRegions: [regionSignal()],
                    titles: ['title', 'title 2'],
                  },
                },
              ];
            },
            startPage: startPageSignal,
            getStartPage(): Observable<AppRouteValue> {
              return of();
            },
            saveStartPage: () => of(),
          },
          'useValue'
        ),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have a start-page selected initially', () => {
    expect(component['startPageControl'].getRawValue()).toBeNull();
  });

  it('should select the start-page in the dropdown when it is set in the service', () => {
    component['userService'].startPage.set(testPage);

    Stub.detectChanges();

    expect(component['startPageControl'].getRawValue()).toBe(testPage);
  });

  it('should save the start-page on the server when a value is selected in the dropdown', () => {
    const saveSpy = jest.spyOn(component['userService'], 'saveStartPage');

    component['onStartPageSelectionChange']({
      value: testPage,
    } as MatSelectChange);

    expect(saveSpy).toHaveBeenCalledWith(testPage);
  });
});
