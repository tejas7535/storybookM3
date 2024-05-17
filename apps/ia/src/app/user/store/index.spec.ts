import {
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../core/store/actions';
import { FilterDimension } from '../../shared/models';
import { SystemMessage } from '../../shared/models/system-message';
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
  submitUserFeedback,
  submitUserFeedbackFailure,
  submitUserFeedbackSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from './actions/user.action';
import { initialState, userReducer, UserState } from './index';

describe('User Reducer', () => {
  test('loadUserSettings', () => {
    const action = loadUserSettings();
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeTruthy();
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('loadUserSettingsSuccess', () => {
    const action = loadUserSettingsSuccess({
      data: {
        dimension: FilterDimension.BOARD,
        dimensionKey: '2',
        dimensionDisplayName: 'Two',
      },
    });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.data.dimension).toEqual(FilterDimension.BOARD);
    expect(state.settings.data.dimensionKey).toEqual('2');
    expect(state.settings.data.dimensionDisplayName).toEqual('Two');
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('loadUserSettingsFailure', () => {
    const errorMessage = 'error';
    const action = loadUserSettingsFailure({ errorMessage });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.errorMessage).toEqual(errorMessage);
  });

  test('updateUserSettings', () => {
    const dimension = FilterDimension.ORG_UNIT;
    const dimensionKey = '123';
    const dimensionDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettings({
      data: { dimension, dimensionKey, dimensionDisplayName },
    });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeTruthy();
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsSuccess', () => {
    const dimension = FilterDimension.ORG_UNIT;
    const dimensionKey = '123';
    const dimensionDisplayName = 'SH/ZHZ-HR (Human resources reporting)';
    const action = updateUserSettingsSuccess({
      data: { dimension, dimensionKey, dimensionDisplayName },
    });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.data.dimensionKey).toEqual(dimensionKey);
    expect(state.settings.data.dimensionDisplayName).toEqual(
      dimensionDisplayName
    );
    expect(state.settings.errorMessage).toBeUndefined();
  });

  test('updateUserSettingsFailure', () => {
    const errorMessage = 'error';
    const action = updateUserSettingsFailure({ errorMessage });
    const state = userReducer(initialState, action);

    expect(state.settings.loading).toBeFalsy();
    expect(state.settings.errorMessage).toEqual(errorMessage);
  });

  test('loadUserSettingsDimensionData', () => {
    const action = loadUserSettingsDimensionData({
      filterDimension: FilterDimension.COUNTRY,
      searchFor: 'co',
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeTruthy();
  });

  test('loadFilterDimensionDataSuccess', () => {
    const filterDimension = FilterDimension.ORG_UNIT;

    const action = loadFilterDimensionDataSuccess({
      filterDimension,
      items: [],
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeFalsy();
  });

  test('loadFilterDimensionDataFailure', () => {
    const filterDimension = FilterDimension.ORG_UNIT;
    const errorMessage = 'error';
    const action = loadFilterDimensionDataFailure({
      filterDimension,
      errorMessage,
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeFalsy();
  });

  test('loadFilterDimensionData', () => {
    const action = loadFilterDimensionData({
      filterDimension: FilterDimension.COUNTRY,
      searchFor: 'co',
    });
    const state = userReducer(initialState, action);

    expect(state.settings.dialog.selectedDimensionDataLoading).toBeTruthy();
  });

  test('submitUserFeedback', () => {
    const action = submitUserFeedback({
      feedback: { category: 'idea', message: 'new feature' },
    });

    const state = userReducer(initialState, action);

    expect(state.feedback.loading).toBeTruthy();
  });

  test('submitUserFeedbackSuccess', () => {
    const action = submitUserFeedbackSuccess();

    const state = userReducer(initialState, action);

    expect(state.feedback.loading).toBeFalsy();
  });

  test('submitUserFeedbackFailure', () => {
    const action = submitUserFeedbackFailure();

    const state = userReducer(initialState, action);

    expect(state.feedback.loading).toBeFalsy();
  });

  test('loadSystemMessage', () => {
    const action = loadSystemMessage();

    const state = userReducer(initialState, action);

    expect(state.systemMessage.loading).toBeTruthy();
  });

  test('loadSystemMessageSuccess', () => {
    const data: SystemMessage[] = [
      {
        id: 1,
        message: 'System message',
        type: 'info',
      },
    ];
    const action = loadSystemMessageSuccess({ data });

    const state = userReducer(initialState, action);

    expect(state.systemMessage.loading).toBeFalsy();
    expect(state.systemMessage.data.entities[1]).toBe(data[0]);
    expect(state.systemMessage.data.ids.length).toBe(1);
    expect(state.systemMessage.data.ids).toEqual([1]);
  });

  test('loadSystemMessageFailure', () => {
    const action = loadSystemMessageFailure({ errorMessage: 'error' });

    const state = userReducer(initialState, action);

    expect(state.systemMessage.loading).toBeFalsy();
  });

  test('dismissSystemMessage', () => {
    const id = 1;
    const action = dismissSystemMessage({ id });

    const state = userReducer(initialState, action);

    expect(state.systemMessage.loading).toBeTruthy();
  });

  test('dismissSystemMessageSuccess', () => {
    const id = 1;
    const action = dismissSystemMessageSuccess({ id });
    const fakeState: UserState = {
      ...initialState,
      systemMessage: {
        ...initialState.systemMessage,
        data: {
          ids: [id],
          entities: {
            [id]: {
              id,
              message: 'System message',
              type: 'info',
            },
          },
        },
      },
    };

    const state = userReducer(fakeState, action);

    expect(state.systemMessage.data.entities[id]).toBeUndefined();
    expect(state.systemMessage.data.ids.length).toEqual(0);
    expect(state.systemMessage.loading).toBeFalsy();
  });

  test('dismissSystemMessageFailure', () => {
    const action = dismissSystemMessageFailure({ errorMessage: 'error' });

    const state = userReducer(initialState, action);

    expect(state.systemMessage.loading).toBeFalsy();
    expect(state.systemMessage.errorMessage).toEqual('error');
  });
});
