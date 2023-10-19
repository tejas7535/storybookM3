import { of } from 'rxjs';

import { UserRoles } from '@gq/shared/constants';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  userHasGPCRole,
  userHasManualPriceRole,
  userHasRegionGreaterChinaRole,
  userHasSQVRole,
} from '../selectors';
import { RolesFacade } from './roles.facade';

describe('RolesFacade', () => {
  let service: RolesFacade;
  let spectator: SpectatorService<RolesFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: RolesFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('should provide userHasManualPriceRole', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasManualPriceRole, of(true));
        m.expect(service.userHasManualPriceRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('should provide userHasGPCRole', () => {
    it('should return false', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasGPCRole, of(false));
        m.expect(service.userHasGPCRole$).toBeObservable(
          m.cold('a', { a: false })
        );
      });
    });
  });

  describe('should provide userHasSQVRole', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasSQVRole, of(true));
        m.expect(service.userHasSQVRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('should provide userHasRegionGreaterChinaRole', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasRegionGreaterChinaRole, of(true));
        m.expect(service.userHasRegionGreaterChinaRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('userHasAccessToComparableTransactions$', () => {
    test(
      'should provide true when NOT Greater_China',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_AMERICAS],
              },
            },
          },
        });
        m.expect(service.userHasAccessToComparableTransactions$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide true when Greater_China and all cost roles',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [
                  UserRoles.REGION_GREATER_CHINA,
                  UserRoles.COST_SQV,
                  UserRoles.COST_GPC,
                ],
              },
            },
          },
        });
        m.expect(service.userHasAccessToComparableTransactions$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide false when not  Greater_China and no cost roles',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_GREATER_CHINA, UserRoles.COST_SQV],
              },
            },
          },
        });
        m.expect(service.userHasAccessToComparableTransactions$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });
});
