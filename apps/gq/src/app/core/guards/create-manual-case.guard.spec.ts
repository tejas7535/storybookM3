import { RouterModule } from '@angular/router';

import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { CreateManualCaseGuard } from './create-manual-case.guard';

describe('createManualCaseGuard', () => {
  let guard: CreateManualCaseGuard;
  let spectator: SpectatorService<CreateManualCaseGuard>;

  const createService = createServiceFactory({
    service: CreateManualCaseGuard,
    imports: [RouterModule.forRoot([])],
    providers: [MockProvider(FeatureToggleConfigService)],
  });
  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(CreateManualCaseGuard);
  });

  describe('should be created', () => {
    test('should be created', () => {
      expect(guard).toBeTruthy();
    });
  });

  describe('canActivateChild', () => {
    test('should return false if feature is disabled', () => {
      guard['featureToggleService'].isEnabled = jest
        .fn()
        .mockReturnValue(false);
      guard['router'].navigate = jest.fn().mockImplementation();
      const value = guard.canActivateChild({} as any, {} as any);
      expect(value).toBe(false);
    });
    test('should return true if feature is enabled', () => {
      guard['featureToggleService'].isEnabled = jest.fn().mockReturnValue(true);
      guard['router'].navigate = jest.fn().mockImplementation();
      const value = guard.canActivateChild({} as any, {} as any);
      expect(value).toBe(true);
    });
  });
});
