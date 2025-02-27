import { signal } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { Observable, of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';

import { CustomRoute } from '../../../app.routes';
import { AppRoutePath, AppRouteValue } from '../../../app.routes.enum';
import { Region } from '../../../feature/global-selection/model';
import { CurrencyService } from '../../../feature/info/currency.service';
import { UserService } from '../../services/user.service';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let spectator: Spectator<UserSettingsComponent>;
  let userService: SpyObject<UserService>;
  let testPage: AppRouteValue;

  const startPageSignal = signal<AppRouteValue>(null);
  const regionSignal = signal<Region>(null);
  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    providers: [
      mockProvider(CurrencyService, {
        getCurrentCurrency: () => of('EUR'),
        getAvailableCurrencies: () => of([]),
      }),
      mockProvider(TranslocoLocaleService),
      mockProvider(UserService, {
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
      }),
    ],
  });

  beforeEach(() => {
    testPage = AppRoutePath.TodoPage;
    spectator = createComponent();
    userService = spectator.inject(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should update the dropdown data when the region changes', () => {
    const filterSpy = jest.spyOn(userService, 'filterVisibleRoutes');
    regionSignal.set(Region.Europe);
    spectator.detectChanges();
    expect(filterSpy).toHaveBeenCalledTimes(3);
  });

  it('should not have a start-page selected initially', () => {
    expect(spectator.component['startPageControl'].getRawValue()).toBeNull();
  });

  it('should select the start-page in the dropdown when it is set in the service', () => {
    userService.startPage.set(testPage);
    spectator.detectChanges();
    expect(spectator.component['startPageControl'].getRawValue()).toBe(
      testPage
    );
  });

  it('should save the start-page on the server when a value is selected in the dropdown', () => {
    const saveSpy = jest.spyOn(userService, 'saveStartPage');
    spectator.component['onStartPageSelectionChange']({
      value: testPage,
    } as MatSelectChange);
    expect(saveSpy).toHaveBeenCalledWith(testPage);
  });
});
