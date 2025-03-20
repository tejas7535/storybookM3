import { signal } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { MockProvider } from 'ng-mocks';

import { AppRoutePath, AppRouteValue } from '../../../app.routes.enum';
import { Region } from '../../../feature/global-selection/model';
import { CurrencyService } from '../../../feature/info/currency.service';
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
