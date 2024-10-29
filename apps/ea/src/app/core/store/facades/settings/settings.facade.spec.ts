import { SETTINGS_STATE_MOCK } from '@ea/testing/mocks/store/settings-state.mock';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { SettingsFacade } from './settings.facade';

describe('SettingsFacade', () => {
  let spectator: SpectatorService<SettingsFacade>;
  let facade: SettingsFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: SettingsFacade,
    providers: [
      provideMockStore({
        initialState: {
          settings: SETTINGS_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;

    store = spectator.inject(MockStore);
  });

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should provide is NativeMobile value', () => {
    expect(spectator.service.isNativeMobile).toBe(false);
  });

  describe('operationConditions$', () => {
    it(
      'should provide the operation conditions',
      marbles((m) => {
        const expected = m.cold('a', {
          a: SETTINGS_STATE_MOCK.isStandalone,
        });

        m.expect(facade.isStandalone$).toBeObservable(expected);
      })
    );
  });

  describe('dispatch', () => {
    it('should dispatch each action', () => {
      store.dispatch = jest.fn();
      facade.dispatch({ type: 'mock action' });

      expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock action' });
    });
  });
});
