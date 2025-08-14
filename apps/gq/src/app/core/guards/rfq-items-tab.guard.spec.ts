import { RouterModule } from '@angular/router';

import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { RfqItemsTabGuard } from './rfq-items-tab.guard';

describe('RfqItemsTabGuard', () => {
  let guard: RfqItemsTabGuard;
  let spectator: SpectatorService<RfqItemsTabGuard>;

  const createService = createServiceFactory({
    service: RfqItemsTabGuard,
    imports: [RouterModule.forRoot([])],
    providers: [MockProvider(FeatureToggleConfigService)],
  });
  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(RfqItemsTabGuard);
  });

  describe('should be created', () => {
    test('should be created', () => {
      expect(guard).toBeTruthy();
    });
  });

  describe('canActivate', () => {
    test('should return false if feature is disabled', () => {
      guard['featureToggleService'].isEnabled = jest
        .fn()
        .mockReturnValue(false);
      guard['router'].navigate = jest.fn().mockImplementation();
      const value = guard.canActivate();
      expect(value).toBe(false);
    });
    test('should return true if feature is enabled', () => {
      guard['featureToggleService'].isEnabled = jest.fn().mockReturnValue(true);
      guard['router'].navigate = jest.fn().mockImplementation();
      const value = guard.canActivate();
      expect(value).toBe(true);
    });
  });
});
