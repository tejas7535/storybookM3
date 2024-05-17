import { FilterDimension } from '../../../shared/models';
import { ISystemMessage } from '../../../shared/models/system-message';
import { UserFeedback } from '../../user-settings/models';
import {
  dismissSystemMessage,
  dismissSystemMessageFailure,
  dismissSystemMessageSuccess,
  loadSystemMessage,
  loadSystemMessageFailure,
  loadSystemMessageSuccess,
  loadUserSettings,
  loadUserSettingsDimensionData,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  showUserSettingsDialog,
  submitUserFeedback,
  submitUserFeedbackFailure,
  submitUserFeedbackSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from './user.action';

describe('User Actions', () => {
  describe('Load User Settings', () => {
    test('loadUserSettings', () => {
      const action = loadUserSettings();

      expect(action).toEqual({
        type: '[User] Load User`s Settings',
      });
    });

    test('loadUserSettingsSuccess', () => {
      const dimension = FilterDimension.BOARD;
      const dimensionKey = '123';
      const dimensionDisplayName = 'IT';
      const action = loadUserSettingsSuccess({
        data: { dimension, dimensionKey, dimensionDisplayName },
      });

      expect(action).toEqual({
        type: '[User] Load User`s Settings Success',
        data: { dimension, dimensionKey, dimensionDisplayName },
      });
    });

    test('loadUserSettingsFailure', () => {
      const action = loadUserSettingsFailure({ errorMessage: 'error' });

      expect(action).toEqual({
        type: '[User] Load User`s Settings Failure',
        errorMessage: 'error',
      });
    });
  });

  describe('Update User Settings', () => {
    const dimension = FilterDimension.BOARD;
    const dimensionKey = '123';
    const dimensionDisplayName = 'IT';

    test('updateUserSettings', () => {
      const action = updateUserSettings({
        data: { dimensionKey, dimensionDisplayName },
      });

      expect(action).toEqual({
        type: '[User] Update User`s Settings',
        data: { dimensionKey, dimensionDisplayName },
      });
    });

    test('updateUserSettingsSuccess', () => {
      const action = updateUserSettingsSuccess({
        data: { dimension, dimensionKey, dimensionDisplayName },
      });

      expect(action).toEqual({
        type: '[User] Update User`s Settings Success',
        data: { dimension, dimensionKey, dimensionDisplayName },
      });
    });

    test('updateUserSettingsFailure', () => {
      const action = updateUserSettingsFailure({ errorMessage: 'error' });

      expect(action).toEqual({
        type: '[User] Update User`s Settings Failure',
        errorMessage: 'error',
      });
    });
  });

  test('showUserSettingsDialog', () => {
    const action = showUserSettingsDialog();

    expect(action).toEqual({
      type: '[User] Show User Settings Dialog',
    });
  });

  test('loadUserSettingsDimensionData', () => {
    const searchFor = 'search';
    const filterDimension = FilterDimension.BOARD;
    const action = loadUserSettingsDimensionData({
      searchFor,
      filterDimension,
    });

    expect(action).toEqual({
      type: '[User] Load User Settings Dimension Data',
      searchFor,
      filterDimension,
    });
  });

  test('submitUserFeedback', () => {
    const feedback: UserFeedback = {
      category: 'Problem',
      message: 'I found a bug.',
    };
    const action = submitUserFeedback({ feedback });

    expect(action).toEqual({
      type: '[User] Submit User Feedback',
      feedback,
    });
  });

  test('submitUserFeedbackSuccess', () => {
    const action = submitUserFeedbackSuccess();

    expect(action).toEqual({
      type: '[User] Submit User Feedback Success',
    });
  });

  test('submitUserFeedbackFailure', () => {
    const action = submitUserFeedbackFailure();

    expect(action).toEqual({
      type: '[User] Submit User Feedback Failure',
    });
  });

  test('loadSystemMessages', () => {
    const action = loadSystemMessage();

    expect(action).toEqual({
      type: '[User] Load System Message',
    });
  });

  test('loadSystemMessageSuccess', () => {
    const data: ISystemMessage[] = [
      { id: 123, message: 'message', type: 'info' },
    ];
    const action = loadSystemMessageSuccess({ data });

    expect(action).toEqual({
      type: '[User] Load System Message Success',
      data,
    });
  });

  test('loadSystemMessageFailure', () => {
    const action = loadSystemMessageFailure({ errorMessage: 'error' });

    expect(action).toEqual({
      type: '[User] Load System Message Failure',
      errorMessage: 'error',
    });
  });

  test('dismissSystemMessage', () => {
    const action = dismissSystemMessage({ id: 321 });

    expect(action).toEqual({
      type: '[User] Dismiss System Message',
      id: 321,
    });
  });

  test('dismissSystemMessageSuccess', () => {
    const action = dismissSystemMessageSuccess({ id: 123 });

    expect(action).toEqual({
      type: '[User] Dismiss System Message Success',
      id: 123,
    });
  });

  test('dismissSystemMessageFailure', () => {
    const action = dismissSystemMessageFailure({ errorMessage: 'abc' });

    expect(action).toEqual({
      type: '[User] Dismiss System Message Failure',
      errorMessage: 'abc',
    });
  });
});
