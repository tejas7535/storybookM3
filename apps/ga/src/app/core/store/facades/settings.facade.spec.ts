import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { AppDelivery } from '@ga/shared/models';
import { SETTINGS_STATE_MOCK } from '@ga/testing/mocks';

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

  describe('appDelivery$', () => {
    it(
      'should provide app delivery',
      marbles((m) => {
        const expected = m.cold('a', {
          a: AppDelivery.Standalone,
        });

        m.expect(facade.appDelivery$).toBeObservable(expected);
      })
    );
  });

  describe('appIsEmbedded$', () => {
    it(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', {
          a: false,
        });

        m.expect(facade.appIsEmbedded$).toBeObservable(expected);
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
