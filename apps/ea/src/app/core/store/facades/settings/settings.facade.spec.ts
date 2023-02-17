import {
  BEARING_DESIGNATION_MOCK,
  SETTINGS_STATE_MOCK,
} from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
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

  describe('bearingDesignation$', () => {
    it(
      'should provide the selected bearing designation',
      marbles((m) => {
        const expected = m.cold('a', {
          a: BEARING_DESIGNATION_MOCK,
        });

        m.expect(facade.bearingDesignation$).toBeObservable(expected);
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
