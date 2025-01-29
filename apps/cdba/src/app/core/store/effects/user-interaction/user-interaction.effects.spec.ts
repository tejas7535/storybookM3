import { MatSnackBar } from '@angular/material/snack-bar';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  BomExportProgress,
  BomExportStatus,
} from '@cdba/user-interaction/model/feature/bom-export';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';
import { UserInteractionService } from '@cdba/user-interaction/service/user-interaction.service';

import {
  loadInitialBomExportStatus,
  loadInitialBomExportStatusFailure,
  loadInitialBomExportStatusSuccess,
  showSnackBar,
  trackBomExportStatus,
} from '../../actions';
import { UserInteractionEffects } from './user-interaction.effects';

describe('UserInteractionEffects', () => {
  let spectator: SpectatorService<UserInteractionEffects>;
  let actions$: any;
  let userInteractionService: UserInteractionService;
  let effects: UserInteractionEffects;

  const createService = createServiceFactory({
    service: UserInteractionEffects,
    providers: [
      UserInteractionEffects,
      provideMockActions(() => actions$),
      mockProvider(UserInteractionService),
      mockProvider(MatSnackBar),
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(UserInteractionEffects);
    userInteractionService = spectator.inject(UserInteractionService);
  });

  describe('loadInitialBomExportStatus$', () => {
    it(
      'should return bom export status when REST is successful',
      marbles((m) => {
        const action = loadInitialBomExportStatus();
        actions$ = m.hot('-a', { a: action });

        const status = {
          requestedBy: 'poltokzy',
          downloadUrl: '',
          downloadUrlExpiry: '2024-12-05T17:17:00',
          progress: BomExportProgress.FINISHED,
          started: '2024-12-05T17:17:00',
          stopped: '',
        } as BomExportStatus;

        const result = loadInitialBomExportStatusSuccess({ status });
        const expected = m.cold('--(a)', { a: result });

        userInteractionService.loadInitialBomExportStatus = jest.fn(() =>
          m.cold('-a|', { a: status })
        );

        m.expect(effects.loadInitialBomExportStatus$).toBeObservable(expected);
        m.flush();
        expect(
          userInteractionService.loadInitialBomExportStatus
        ).toHaveBeenCalled();
      })
    );

    it(
      'should invoke bom status tracking when export is in progress and REST is successful',
      marbles((m) => {
        const action = loadInitialBomExportStatus();
        actions$ = m.hot('-a', { a: action });

        const status = {
          requestedBy: 'poltokzy',
          downloadUrl: '',
          downloadUrlExpiry: '2024-12-05T17:17:00',
          progress: BomExportProgress.IN_PROGRESS_1,
          started: '2024-12-05T17:17:00',
          stopped: '',
        } as BomExportStatus;

        const resultA = loadInitialBomExportStatusSuccess({ status });
        const resultB = trackBomExportStatus();
        const expected = m.cold('--(ab)', { a: resultA, b: resultB });

        userInteractionService.loadInitialBomExportStatus = jest.fn(() =>
          m.cold('-a|', { a: status })
        );

        m.expect(effects.loadInitialBomExportStatus$).toBeObservable(expected);
        m.flush();
        expect(
          userInteractionService.loadInitialBomExportStatus
        ).toHaveBeenCalled();
      })
    );

    it(
      'should return error when REST fails',
      marbles((m) => {
        const action = loadInitialBomExportStatus();
        actions$ = m.hot('-a', { a: action });

        const snackBar = showSnackBar({
          interactionType: InteractionType.GET_BOM_EXPORT_STATUS_FAILURE,
        });
        const result = loadInitialBomExportStatusFailure({
          errorMessage: 'TEST',
        });
        const expected = m.cold('--(ab)', { a: snackBar, b: result });

        userInteractionService.loadInitialBomExportStatus = jest.fn(() =>
          m.cold('-#|', {}, new Error('TEST'))
        );

        m.expect(effects.loadInitialBomExportStatus$).toBeObservable(expected);
        m.flush();
        expect(
          userInteractionService.loadInitialBomExportStatus
        ).toHaveBeenCalled();
      })
    );
  });
});
