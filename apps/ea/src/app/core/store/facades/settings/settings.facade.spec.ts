import { SETTINGS_STATE_MOCK } from '@ea/testing/mocks/store/settings-state.mock';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { SettingsFacade } from './settings.facade';

describe('SettingsFacade', () => {
  let spectator: SpectatorService<SettingsFacade>;
  let facade: SettingsFacade;

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
  });

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
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
});
