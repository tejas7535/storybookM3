import { of } from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { RoleFacade } from '@cdba/core/auth/role-facade/role.facade';
import { BetaFeature } from '@cdba/shared/constants/beta-feature';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { BetaFeatureService } from './beta-feature.service';

describe('BetaFeatureService', () => {
  let spectator: SpectatorService<BetaFeatureService>;
  let service: BetaFeatureService;

  let localStorageService: LocalStorageService;
  let roleFacadeMock: jest.Mocked<RoleFacade>;

  const createService = createServiceFactory({
    service: BetaFeatureService,
    providers: [
      mockProvider(LocalStorageService),
      {
        provide: RoleFacade,
        useValue: {
          hasBetaUserRole$: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(BetaFeatureService);

    roleFacadeMock = spectator.inject(RoleFacade) as jest.Mocked<RoleFacade>;
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

  describe('canAccessBetaFeature$', () => {
    it('should return observable that emits true if beta feature is enabled and user has beta role', (done) => {
      localStorageService.getItem = jest.fn().mockReturnValue(true);
      roleFacadeMock.hasBetaUserRole$ = of(true);

      service
        .canAccessBetaFeature$(BetaFeature.PORTFOLIO_ANALYSIS)
        .subscribe((canAccess) => {
          expect(canAccess).toBe(true);
          done();
        });
    });

    it('should return observable that emits false if beta feature is disabled', (done) => {
      localStorageService.getItem = jest.fn().mockReturnValue(false);
      roleFacadeMock.hasBetaUserRole$ = of(true);

      service
        .canAccessBetaFeature$(BetaFeature.PORTFOLIO_ANALYSIS)
        .subscribe((canAccess) => {
          expect(canAccess).toBe(false);
          done();
        });
    });

    it('should return observable that emits false if user does not have beta role', (done) => {
      localStorageService.getItem = jest.fn().mockReturnValue(true);
      roleFacadeMock.hasBetaUserRole$ = of(false);

      service
        .canAccessBetaFeature$(BetaFeature.PORTFOLIO_ANALYSIS)
        .subscribe((canAccess) => {
          expect(canAccess).toBe(false);
          done();
        });
    });
  });
});
