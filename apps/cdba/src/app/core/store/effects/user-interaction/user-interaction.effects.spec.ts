import { MatSnackBar } from '@angular/material/snack-bar';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles';

import { UserInteractionService } from '@cdba/shared/services';

import { exportBomsSuccess } from '../../actions';
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
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(UserInteractionEffects);
    userInteractionService = spectator.inject(UserInteractionService);
  });

  describe('userInteractionOnExportBomsSuccess$', () => {
    it(
      'should interact when boms are exported successfully',
      marbles((m) => {
        const action = exportBomsSuccess();
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: action });

        jest.spyOn(userInteractionService, 'interact');

        m.expect(effects.userInteractionOnExportBomsSuccess$).toBeObservable(
          expected
        );
        m.flush();
        expect(userInteractionService.interact).toHaveBeenCalledWith(
          expect.anything()
        );
      })
    );
  });
});
