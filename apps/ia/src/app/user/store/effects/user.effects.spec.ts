import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { getIsLoggedIn, loginSuccess } from '@schaeffler/azure-auth';
import { closeBanner, openBanner } from '@schaeffler/banner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  filterDimensionSelected,
  filterSelected,
  loadFilterDimensionData,
} from '../../../core/store/actions';
import { FilterDimension, IdValue } from '../../../shared/models';
import { SystemMessage } from '../../../shared/models/system-message';
import { SystemMessageService } from '../../system-message/system-message.service';
import { UserFeedback } from '../../user-settings/models';
import { UserSettings } from '../../user-settings/models/user-settings.model';
import { UserSettingsService } from '../../user-settings/user-settings.service';
import { UserSettingsDialogComponent } from '../../user-settings/user-settings-dialog/user-settings-dialog.component';
import {
  dismissSystemMessage,
  dismissSystemMessageFailure,
  dismissSystemMessageSuccess,
  initUserEffects,
  loadSystemMessage,
  loadSystemMessageFailure,
  loadSystemMessageSuccess,
  loadUserSettings,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  openIABanner,
  showUserSettingsDialog,
  submitUserFeedback,
  submitUserFeedbackFailure,
  submitUserFeedbackSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from '../actions/user.action';
import {
  getActiveSystemMessageId,
  getFavoriteDimension,
  getFavoriteDimensionIdValue,
  getSystemMessageCount,
} from '../selectors/user.selector';
import { UserEffects } from './user.effects';

class MockDialog {
  openDialogs = [{}];
  open(): any {}
  closeAll(): void {}
}
describe('User Settings Effects', () => {
  let spectator: SpectatorService<UserEffects>;
  let actions$: any;
  let userSettingsService: UserSettingsService;
  let systemMessageService: SystemMessageService;
  let translocoService: TranslocoService;
  let action: any;
  let effects: UserEffects;
  let dialog: MockDialog;
  let metadata: EffectsMetadata<UserEffects>;
  let snackbar: MatSnackBar;
  let store: MockStore;

  const error = {
    message: 'An error message occured',
  };

  const createService = createServiceFactory({
    service: UserEffects,
    imports: [
      MatDialogModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: UserSettingsService,
        useValue: {
          getInitialFilters: jest.fn(),
        },
      },
      {
        provide: SystemMessageService,
        useValue: {
          getSystemMessage: jest.fn(),
          dismissSystemMessage: jest.fn(),
        },
      },
      { provide: MatDialog, useClass: MockDialog },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(UserEffects);
    userSettingsService = spectator.inject(UserSettingsService);
    systemMessageService = spectator.inject(SystemMessageService);
    dialog = spectator.inject(MatDialog);
    metadata = getEffectsMetadata(effects);
    snackbar = spectator.inject(MatSnackBar);
    store = spectator.inject(MockStore);
    translocoService = spectator.inject(TranslocoService);
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
        const resultFilter = filterSelected({
          filter: {
            name: dimension,
            idValue: {
              id: dimensionKey,
              value: dimensionDisplayName,
            },
          },
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
        const resultFilter = filterSelected({
          filter: {
            name: dimension,
            idValue: {
              id: dimensionKey,
              value: dimensionDisplayName,
            },
          },
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
          selectedDimensionIdValue: idValue,
          initialLoad: false,
        },
      });
    });

    test('should open dialog with initial load true when no favorite dimension set', () => {
      action = showUserSettingsDialog();
      actions$ = of(action);
      store.overrideSelector(getFavoriteDimension, FilterDimension.BOARD);
      store.overrideSelector(getFavoriteDimensionIdValue, undefined as IdValue);

      dialog.open = jest.fn();

      effects.showUserSettingsDialog$.subscribe();

      expect(dialog.open).toHaveBeenCalledWith(UserSettingsDialogComponent, {
        disableClose: true,
        data: {
          dimension,
          selectedDimensionIdValue: undefined,
          initialLoad: true,
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
          selectedDimensionIdValue: idValue,
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
      'should return filterDimensionSelected and loadSystemMessage',
      marbles((m) => {
        const filter = {
          name: FilterDimension.BOARD,
          idValue: {
            id: '123',
            value: 'SH/ZHZ-HR (Human resources reporting)',
          },
        };
        snackbar.open = jest.fn();

        const resultFilterDimensionSelected = filterDimensionSelected({
          filter,
          filterDimension: FilterDimension.BOARD,
        });

        const resultLoadSystemMessage = loadSystemMessage();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bc)', {
          b: resultLoadSystemMessage,
          c: resultFilterDimensionSelected,
        });

        m.expect(effects.updateUserSettingsSuccess$).toBeObservable(expected);
        m.flush();
        expect(snackbar.open).toHaveBeenCalledWith('translate it');
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

  describe('submitUserFeedback$', () => {
    const feedback: UserFeedback = { category: 'idea', message: 'new idea' };
    beforeEach(() => {
      action = submitUserFeedback({ feedback });
    });

    test(
      'should return submitUserFeedbackSuccess on success',
      marbles((m) => {
        const result = submitUserFeedbackSuccess();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--b', { b: result });
        const response = m.cold('-c', { c: feedback });

        userSettingsService.submitUserFeedback = jest
          .fn()
          .mockImplementation(() => response);

        m.expect(effects.submitUserFeedback$).toBeObservable(expected);
        m.flush();
        expect(userSettingsService.submitUserFeedback).toHaveBeenCalledWith(
          feedback
        );
      })
    );
  });

  describe('submitUserFeedbackSuccess', () => {
    beforeEach(() => {
      action = submitUserFeedbackSuccess();
    });

    test('should close dialog and open snackbar', () => {
      actions$ = of(action);

      dialog.closeAll = jest.fn();
      snackbar.open = jest.fn();

      effects.submitUserFeedbackSuccess$.subscribe();

      expect(dialog.closeAll).toHaveBeenCalledTimes(1);
      expect(snackbar.open).toHaveBeenCalledWith('translate it');
    });
  });

  describe('submitUserFeedbackFailure$', () => {
    beforeEach(() => {
      action = submitUserFeedbackFailure();
    });
    test('should have dispatch set to false', () => {
      expect(metadata.submitUserFeedbackFailure$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should show toast message', () => {
      actions$ = of(action);

      snackbar.open = jest.fn();

      effects.submitUserFeedbackFailure$.subscribe();

      expect(snackbar.open).toHaveBeenCalledWith('translate it');
    });
  });

  describe('loadSystemMessage$', () => {
    beforeEach(() => {
      action = loadSystemMessage();
    });

    test(
      'should return loadSystemMessageSuccess on success',
      marbles((m) => {
        const data: SystemMessage[] = [
          {
            id: 1,
            message: 'System message',
            type: 'info',
          },
        ];
        const result = loadSystemMessageSuccess({ data });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--b', { b: result });
        const response = m.cold('-c', { c: data });

        systemMessageService.getSystemMessage = jest
          .fn()
          .mockReturnValue(response);

        m.expect(effects.loadSystemMessage$).toBeObservable(expected);
        m.flush();
        expect(systemMessageService.getSystemMessage).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadSystemMessageFailure on REST error',
      marbles((m) => {
        const result = loadSystemMessageFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        systemMessageService.getSystemMessage = jest
          .fn()
          .mockReturnValue(response);

        m.expect(effects.loadSystemMessage$).toBeObservable(expected);
        m.flush();
        expect(systemMessageService.getSystemMessage).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('dismissSystemMessage$', () => {
    const id = 123;
    beforeEach(() => {
      action = dismissSystemMessage({ id });
    });

    test(
      'should return dismissSystemMessageSuccess on success',
      marbles((m) => {
        const result = dismissSystemMessageSuccess({ id });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('--b', { b: result });

        const response = m.cold('-c', { c: id });

        systemMessageService.dismissSystemMessage = jest
          .fn()
          .mockReturnValue(response);

        m.expect(effects.dismissSystemMessage$).toBeObservable(expected);
        m.flush();
        expect(systemMessageService.dismissSystemMessage).toHaveBeenCalledWith(
          id
        );
      })
    );

    test(
      'should return dismissSystemMessageFailure on REST error',
      marbles((m) => {
        const result = dismissSystemMessageFailure({
          errorMessage: error.message,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        systemMessageService.dismissSystemMessage = jest
          .fn()
          .mockReturnValue(response);

        m.expect(effects.dismissSystemMessage$).toBeObservable(expected);
        m.flush();
        expect(systemMessageService.dismissSystemMessage).toHaveBeenCalledTimes(
          1
        );
      })
    );
  });

  describe('closeBanner$', () => {
    test(
      'should return dismissSystemMessage',
      marbles((m) => {
        const id = 123;
        action = closeBanner();
        actions$ = m.hot('--a', { a: action });
        const result = dismissSystemMessage({ id });
        const expected = m.cold('--b', { b: result });
        store.overrideSelector(getActiveSystemMessageId, id);

        m.expect(effects.closeBanner$).toBeObservable(expected);
      })
    );
  });

  describe('initUserEffects$', () => {
    test(
      'should dispatch init actions',
      marbles((m) => {
        action = initUserEffects();
        const loadUserSettingsAction = loadUserSettings();
        const loadSystemMessageAction = loadSystemMessage();

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-(bc)', {
          b: loadUserSettingsAction,
          c: loadSystemMessageAction,
        });

        m.expect(effects.initUserEffects$).toBeObservable(expected$);
        m.flush();
      })
    );
  });

  describe('openIABanner$', () => {
    test(
      'should return openBanner with dismiss text button',
      marbles((m) => {
        const systemMessage: SystemMessage = {
          id: 123,
          message: 'System message',
          type: 'info',
        };
        translocoService.selectTranslateObject = jest
          .fn()
          .mockReturnValue(
            of({ dismiss: 'dismiss', nextMessage: 'Next Message' })
          );
        store.overrideSelector(getSystemMessageCount, 5);
        effects.getTruncationSize = jest.fn().mockReturnValue(5);

        action = openIABanner({ systemMessage });
        actions$ = m.hot('-a', { a: action });
        const result = openBanner({
          text: 'System message',
          buttonText: 'Next Message',
          icon: 'info',
          truncateSize: 5,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.openIABanner$).toBeObservable(expected);
      })
    );
  });

  describe('getTruncationSize', () => {
    test('should return undefined if the message is not defined', () => {
      expect(
        effects.getTruncationSize(undefined as string, 10)
      ).toBeUndefined();
    });

    test('should return 10 if the message length is 5 and max size 10', () => {
      expect(effects.getTruncationSize('12345', 10)).toBeUndefined();
    });

    test('should return 5 if the message length in HTML tag is 6', () => {
      expect(effects.getTruncationSize('<p>123456</p>', 5)).toBe(5);
    });
  });
});
