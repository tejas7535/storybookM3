import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { getIsLoggedIn, loginSuccess } from '@schaeffler/azure-auth';

import {
  filterDimensionSelected,
  loadFilterDimensionData,
} from '../../../core/store/actions';
import { FilterDimension, IdValue } from '../../../shared/models';
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
import {
  getFavoriteDimension,
  getFavoriteDimensionIdValue,
} from '../selectors/user-settings.selector';
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
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: UserSettingsEffects,
    imports: [MatDialogModule, MatSnackBarModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
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
    store = spectator.inject(MockStore);
  });

  describe('loadUserSettings$', () => {
    beforeEach(() => {
      action = loadUserSettings();
    });

    test(
      'should return loadUserSettingsSuccess, filterDimensionSelected, and loadFilterDimensionData on success and if org unit is set',
      marbles((m) => {
        store.overrideSelector(getIsLoggedIn, true);
        const dimension = FilterDimension.BOARD;
        const dimensionKey = '2';
        const dimensionDisplayName = 'Two';
        const result = loadUserSettingsSuccess({
          data: {
            dimension,
            dimensionKey,
            dimensionDisplayName,
          },
        });
        const resultFilter = filterDimensionSelected({
          filter: {
            name: dimension,
            idValue: {
              id: dimensionKey,
              value: dimensionDisplayName,
            },
          },
          filterDimension: dimension,
        });

        const resultDimensionData = loadFilterDimensionData({
          filterDimension: dimension,
        });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--(bcd)', {
          b: result,
          c: resultFilter,
          d: resultDimensionData,
        });
        const response = m.cold('-c', {
          c: { dimension, dimensionKey, dimensionDisplayName },
        });

        userSettingsService.getUserSettings = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.getUserSettings).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should also work for loginSuccess',
      marbles((m) => {
        store.overrideSelector(getIsLoggedIn, true);
        const dimension = FilterDimension.BOARD;
        const dimensionKey = '2';
        const dimensionDisplayName = 'Two';
        const result = loadUserSettingsSuccess({
          data: {
            dimension,
            dimensionKey,
            dimensionDisplayName,
          },
        });
        const resultFilter = filterDimensionSelected({
          filter: {
            name: dimension,
            idValue: {
              id: dimensionKey,
              value: dimensionDisplayName,
            },
          },
          filterDimension: dimension,
        });

        const resultDimensionData = loadFilterDimensionData({
          filterDimension: dimension,
        });

        actions$ = m.hot('-a', { a: loginSuccess({} as any) });
        const expected = m.cold('--(bcd)', {
          b: result,
          c: resultFilter,
          d: resultDimensionData,
        });
        const response = m.cold('-c', {
          c: { dimension, dimensionKey, dimensionDisplayName },
        });

        userSettingsService.getUserSettings = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.loadUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.getUserSettings).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadUserSettingsSuccess and showUserSettingsDialog on success and if dimensionKey not set',
      marbles((m) => {
        store.overrideSelector(getIsLoggedIn, true);
        const resultSuccess = loadUserSettingsSuccess({
          data: {
            dimensionKey: undefined,
            dimension: FilterDimension.BOARD,
            dimensionDisplayName: undefined,
          },
        });
        const resultShowUpdate = showUserSettingsDialog();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--(bc)', {
          b: resultSuccess,
          c: resultShowUpdate,
        });
        const response = m.cold('-c', {
          c: {
            dimensionKey: undefined,
            dimension: FilterDimension.BOARD,
            dimensionDisplayName: undefined,
          },
        });

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
        store.overrideSelector(getIsLoggedIn, true);
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

    test(
      'should do nothing if not logged in',
      marbles((m) => {
        store.overrideSelector(getIsLoggedIn, false);

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('----');

        userSettingsService.getUserSettings = jest.fn();

        m.expect(effects.loadUserSettings$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.getUserSettings).not.toHaveBeenCalled();
      })
    );
  });

  describe('showUserSettingsDialog$', () => {
    let dimension: FilterDimension;
    let idValue: IdValue;

    beforeEach(() => {
      dimension = FilterDimension.BOARD;
      idValue = new IdValue('1', 'test');

      store.overrideSelector(getFavoriteDimension, dimension);
      store.overrideSelector(getFavoriteDimensionIdValue, idValue);
    });

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
        data: {
          dimension,
          selectedBusinessArea: idValue,
          initialLoad: false,
        },
      });
    });

    test('should open dialog on loadUserSettingsFailure', () => {
      action = loadUserSettingsFailure({ errorMessage: 'Error' });
      actions$ = of(action);

      dialog.open = jest.fn();

      effects.showUserSettingsDialog$.subscribe();

      expect(dialog.open).toHaveBeenCalledWith(UserSettingsDialogComponent, {
        disableClose: true,
        data: {
          dimension,
          selectedBusinessArea: idValue,
          initialLoad: false,
        },
      });
    });
  });

  describe('updateUserSettings$', () => {
    const data: UserSettings = {
      dimension: FilterDimension.BOARD,
      dimensionKey: '123',
      dimensionDisplayName: 'SH/ZHZ-HR (Human resources reporting)',
    };

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
          dimension: FilterDimension.BOARD,
          dimensionKey: '123',
          dimensionDisplayName: 'SH/ZHZ-HR (Human resources reporting)',
        } as UserSettings,
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
      'should return filterDimensionSelected',
      marbles((m) => {
        const filter = {
          name: FilterDimension.BOARD,
          idValue: {
            id: '123',
            value: 'SH/ZHZ-HR (Human resources reporting)',
          },
        };

        const result = filterDimensionSelected({
          filter,
          filterDimension: FilterDimension.BOARD,
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
