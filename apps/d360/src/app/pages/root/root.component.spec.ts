import { signal } from '@angular/core';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';

import { AppRoutePath, AppRouteValue } from '../../app.routes.enum';
import { Region } from '../../feature/global-selection/model';
import { UserService } from '../../shared/services/user.service';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  const mockProviders = [mockProvider(Router, { navigate: jest.fn() })];
  const createComponent = createComponentFactory({
    component: RootComponent,
    providers: mockProviders,
  });

  it('should route european users to OverviewPage', () => {
    const spectator = createComponent({
      providers: [
        ...mockProviders,
        mockProvider(UserService, {
          loadRegion: jest.fn(() => of(Region.Europe)),
          startPage: signal<AppRouteValue>(AppRoutePath.OverviewPage),
        }),
      ],
    });
    const router = spectator.inject(Router);

    expect(router.navigate).toHaveBeenCalledWith([AppRoutePath.OverviewPage]);
  });

  it('should route non-european users to CustomerMaterialDetailsPage', () => {
    const spectator = createComponent({
      providers: [
        ...mockProviders,
        mockProvider(UserService, {
          loadRegion: jest.fn(() => of(Region.GreaterChina)),
          startPage: signal<AppRouteValue>(
            AppRoutePath.CustomerMaterialDetailsPage
          ),
        }),
      ],
    });
    const router = spectator.inject(Router);

    expect(router.navigate).toHaveBeenCalledWith([
      AppRoutePath.CustomerMaterialDetailsPage,
    ]);
  });
});
