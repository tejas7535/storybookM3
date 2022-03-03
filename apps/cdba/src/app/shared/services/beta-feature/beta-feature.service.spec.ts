import { LocalStorageMock } from '@cdba/testing/mocks/storage/local-storage.mock';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BetaFeatureService } from './beta-feature.service';

describe('BetaFeatureService', () => {
  let spectator: SpectatorService<BetaFeatureService>;
  let service: BetaFeatureService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: BetaFeatureService,
    providers: [{ provide: LOCAL_STORAGE, useClass: LocalStorageMock }],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(BetaFeatureService);
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBetaFeature', () => {
    it('should return null if theres no entry in localstorage', () => {
      expect(service.getBetaFeature(undefined)).toBeNull();
    });

    it('should return value for beta feature', () => {
      const mockStore = { beta_feature_portfolioAnalysis: 'true' };
      localStorage.setStore(mockStore);

      expect(service.getBetaFeature('portfolioAnalysis')).toBe(true);
    });
  });

  describe('setBetaFeature', () => {
    it('should set value for beta feature', () => {
      service.setBetaFeature('portfolioAnalysis', true);

      expect(localStorage.store['beta_feature_portfolioAnalysis']).toBe('true');
    });
  });
});
