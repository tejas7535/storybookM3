import { provideMockStore } from '@ngrx/store/testing';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { AUTH_STATE_MOCK } from '@cdba/testing/mocks';
import { marbles } from 'rxjs-marbles';

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

  it('should provide roles', () => {
    marbles((m) => {
      const expected = m.cold('--roles', {
        roles: ['CDBA_FUNC_CALCULATION', 'CDBA_FUNC_APPLICATION_ENGINEERING'],
      });

      m.expect(service.roles$).toBeObservable(expected);
    });
  });

  it('should provide basic role api', () => {
    marbles((m) => {
      const expected = m.cold('--hasBasicRole', {
        hasBasicRole: false,
      });

      m.expect(service.hasBasicRole$).toBeObservable(expected);
    });
  });

  it('should provide pricing role api', () => {
    marbles((m) => {
      const expected = m.cold('--hasAnyPricingRole', {
        hasAnyPricingRole: true,
      });

      m.expect(service.hasAnyPricingRole$).toBeObservable(expected);
    });
  });
});
