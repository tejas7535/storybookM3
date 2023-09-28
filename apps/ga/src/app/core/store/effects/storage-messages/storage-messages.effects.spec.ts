import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { StaticStorageService } from '@ga/core/services/static-storage/static-storage.service';
import { MaintenanceMessage } from '@ga/shared/models/maintenance-message/maintenance-message';
import { APP_STATE_MOCK } from '@ga/testing/mocks';

import { StorageMessagesActions } from '../../actions';
import { StorageMessagesEffects } from './storage-messages.effects';

const staticStorageServiceMock = {
  getMessage: jest.fn(),
  dispatchMessage: jest.fn(),
};

describe('StorageMessagesEffects', () => {
  let action: any;
  let actions$: any;
  let effects: StorageMessagesEffects;
  let spectator: SpectatorService<StorageMessagesEffects>;

  const createService = createServiceFactory({
    service: StorageMessagesEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: APP_STATE_MOCK }),
      {
        provide: StaticStorageService,
        useValue: staticStorageServiceMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(StorageMessagesEffects);
  });

  describe('getMessage', () => {
    beforeEach(() => {
      staticStorageServiceMock.getMessage.mockReset();
    });
    it('should fetch storage message', () => {
      const fetchSpy = jest
        .spyOn(staticStorageServiceMock, 'getMessage')
        .mockImplementation(() => of('result-from-service'));

      return marbles((m) => {
        action = StorageMessagesActions.getStorageMessage();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: StorageMessagesActions.setStorageMessage({
            message: 'result-from-service' as any,
          }),
        });

        m.expect(effects.getStorageMessages$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('dispatchMessage', () => {
    beforeEach(() => {
      staticStorageServiceMock.dispatchMessage.mockReset();
    });

    it(
      'should dispatch message',
      marbles((m) => {
        const message: MaintenanceMessage = {
          type: 'info',
          text: {
            en: 'info',
          },
          buttonText: {
            en: 'ok',
          },
          validFrom: '',
          validTo: '',
        };

        action = StorageMessagesActions.setStorageMessage({ message });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });

        m.expect(effects.setStorageMessages$).toBeObservable(expected);
        m.flush();

        expect(staticStorageServiceMock.dispatchMessage).toHaveBeenCalledWith(
          message
        );
      })
    );
  });
});
