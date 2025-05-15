import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { BetaFeatureService } from './beta-feature.service';

describe('BetaFeatureService', () => {
  let spectator: SpectatorService<BetaFeatureService>;
  let service: BetaFeatureService;
  let localStorageService: LocalStorageService;

  const createService = createServiceFactory({
    service: BetaFeatureService,
    providers: [mockProvider(LocalStorageService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(BetaFeatureService);
    localStorageService = spectator.inject(LocalStorageService);

    localStorageService.getItem = jest.fn().mockReturnValue(undefined);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBetaFeature', () => {
    it('should return undefined if theres no entry in localstorage', () => {
      expect(service.getBetaFeature(undefined)).toBeUndefined();
    });

    it('should return value for beta feature', () => {
      localStorageService.getItem = jest.fn().mockReturnValue(true);

      expect(service.getBetaFeature('portfolioAnalysis')).toBe(true);
    });
  });

  describe('setBetaFeature', () => {
    it('should set value for beta feature', () => {
      const spy = jest.spyOn(localStorageService, 'setItem');

      service.setBetaFeature('portfolioAnalysis', true);

      expect(spy).toHaveBeenCalledWith(
        'beta_feature_portfolioAnalysis',
        true,
        false
      );
    });
  });
});
