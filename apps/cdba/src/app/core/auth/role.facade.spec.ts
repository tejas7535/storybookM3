import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { AUTH_STATE_MOCK } from '@cdba/testing/mocks';

describe('RoleFacade', () => {
  let spectator: SpectatorService<RoleFacade>;
  let service: RoleFacade;

  const createService = createServiceFactory({
    service: RoleFacade,
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
  });

  describe('roles$', () => {
    it(
      'should provide id token roles of user',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            'CDBA_BASIC',
            'CDBA_COST_TYPE_SQV',
            'CDBA_PRODUCT_LINE_03',
            'CDBA_SUB_REGION_21',
          ],
        });

        m.expect(service.roles$).toBeObservable(expected);
      })
    );
  });

  describe('hasBasicRole$', () => {
    it(
      'should return true if user has role CDBA_BASIC',
      marbles((m) => {
        // user has basic role in mock state
        const expected = m.cold('a', {
          a: true,
        });

        m.expect(service.hasBasicRole$).toBeObservable(expected);
      })
    );
  });

  describe('hasPricingRole$', () => {
    it(
      'should return true if user has a COST_TYPE role',
      marbles((m) => {
        // user has role CDBA_COST_TYPE_SQV in mock state

        const expected = m.cold('a', {
          a: true,
        });

        m.expect(service.hasAnyPricingRole$).toBeObservable(expected);
      })
    );
  });
});
