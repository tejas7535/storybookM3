import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { filterSelected } from '../../../core/store/actions';
import { FilterKey } from '../../../shared/models';
import { UserSettings } from '../../models/user-settings.model';
import { UserSettingsService } from '../../user-settings.service';
import { UserSettingsDialogComponent } from '../../user-settings-dialog/user-settings-dialog.component';
import {
  loadUserSettings,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  showUserSettingsDialog,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from '../actions/user-settings.action';
import { UserSettingsEffects } from './user-settings.effects';

class MockDialog {
  openDialogs = [{}];
  open(): any {}
  closeAll(): void {}
}
describe('User Settings Effects', () => {
  let spectator: SpectatorService<UserSettingsEffects>;
  let actions$: any;
  let userSettingsService: UserSettingsService;
  let action: any;
  let effects: UserSettingsEffects;
  let dialog: MockDialog;
  let metadata: EffectsMetadata<UserSettingsEffects>;
  let snackbar: MatSnackBar;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: UserSettingsEffects,
    imports: [MatDialogModule, MatSnackBarModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          data: { orgUnit: 'Sales' },
        },
      }),
      {
        provide: UserSettingsService,
        useValue: {
          getInitialFilters: jest.fn(),
        },
      },
      { provide: MatDialog, useClass: MockDialog },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(UserSettingsEffects);
    userSettingsService = spectator.inject(UserSettingsService);
    dialog = spectator.inject(MatDialog);
    metadata = getEffectsMetadata(effects);
    snackbar = spectator.inject(MatSnackBar);
  });

  describe('loadUserSettings$', () => {
    beforeEach(() => {
      action = loadUserSettings();
    });

    test(
      'should return loadUserSettingsSuccess and filterSelected on success and if org unit is set',
      marbles((m) => {
        const orgUnit = 'Sales';
        const result = loadUserSettingsSuccess({ data: { orgUnit } });
        const resultFilter = filterSelected({
          filter: {
            name: FilterKey.ORG_UNIT,
            idValue: {
              id: orgUnit,
              value: orgUnit,
            },
          },
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--(bc)', { b: result, c: resultFilter });
        const response = m.cold('-c', { c: { orgUnit } });

        userSettingsService.getUserSettings = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.getUserSettings).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadUserSettingsSuccess and showUserSettingsDialog on success and if orgUnit not set',
      marbles((m) => {
        const resultSuccess = loadUserSettingsSuccess({
          data: { orgUnit: undefined },
        });
        const resultShowUpdate = showUserSettingsDialog();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--(bc)', {
          b: resultSuccess,
          c: resultShowUpdate,
        });
        const response = m.cold('-c', { c: { orgUnit: undefined } });

        userSettingsService.getUserSettings = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.getUserSettings).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadUserSettingsFailure on REST error',
      marbles((m) => {
        const result = loadUserSettingsFailure({ errorMessage: error.message });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        userSettingsService.getUserSettings = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.getUserSettings).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('showUserSettingsDialog$', () => {
    test('should have dispatch set to false', () => {
      expect(metadata.showUserSettingsDialog$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should open dialog on showUserSettingsDialog', () => {
      action = showUserSettingsDialog();
      actions$ = of(action);

      dialog.open = jest.fn();

      effects.showUserSettingsDialog$.subscribe();

      expect(dialog.open).toHaveBeenCalledWith(UserSettingsDialogComponent, {
        disableClose: true,
      });
    });

    test('should open dialog on loadUserSettingsFailure', () => {
      action = loadUserSettingsFailure({ errorMessage: 'Error' });
      actions$ = of(action);

      dialog.open = jest.fn();

      effects.showUserSettingsDialog$.subscribe();

      expect(dialog.open).toHaveBeenCalledWith(UserSettingsDialogComponent, {
        disableClose: true,
      });
    });
  });

  describe('updateUserSettings$', () => {
    const data = { orgUnit: 'test' };

    beforeEach(() => {
      action = updateUserSettings({ data });
    });

    test(
      'should return updateUserSettingsSuccess on success',
      marbles((m) => {
        const result = updateUserSettingsSuccess({ data });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--b', { b: result });
        const response = m.cold('-c', { c: data });

        userSettingsService.updateUserSettings = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.updateUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.updateUserSettings).toHaveBeenCalledWith(
          data
        );
      })
    );

    test(
      'should return updateUserSettingsFailure on REST error',
      marbles((m) => {
        const result = updateUserSettingsFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        userSettingsService.updateUserSettings = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.updateUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.updateUserSettings).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('updateUserSettingsSuccess$', () => {
    beforeEach(() => {
      action = updateUserSettingsSuccess({
        data: {
          orgUnit: 'test',
        } as unknown as UserSettings,
      });
    });

    test('should close dialog if dialog is open', () => {
      actions$ = of(action);

      dialog.closeAll = jest.fn();
      snackbar.open = jest.fn();

      effects.updateUserSettingsSuccess$.subscribe();

      expect(dialog.closeAll).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith('translate it');
    });

    test('should only toast message if no dialog is open', () => {
      actions$ = of(action);

      dialog.openDialogs = undefined;
      dialog.closeAll = jest.fn();
      snackbar.open = jest.fn();

      effects.updateUserSettingsSuccess$.subscribe();

      expect(dialog.closeAll).not.toHaveBeenCalled();
      expect(snackbar.open).toHaveBeenCalledWith('translate it');
    });

    test(
      'should return filterSelected',
      marbles((m) => {
        const filter = {
          name: FilterKey.ORG_UNIT,
          idValue: {
            id: 'test',
            value: 'test',
          },
        };

        const result = filterSelected({
          filter,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.updateUserSettingsSuccess$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('updateUserSettingsFailure$', () => {
    beforeEach(() => {
      action = updateUserSettingsFailure({ errorMessage: '' });
    });
    test('should have dispatch set to false', () => {
      expect(metadata.updateUserSettingsFailure$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should show toast message', () => {
      actions$ = of(action);

      snackbar.open = jest.fn();

      effects.updateUserSettingsFailure$.subscribe();

      expect(snackbar.open).toHaveBeenCalledWith('translate it');
    });
  });
});
