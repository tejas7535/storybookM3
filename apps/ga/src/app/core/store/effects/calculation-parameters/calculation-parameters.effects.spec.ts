import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RestService } from '@ga/core/services';
import {
  getDialog,
  getDialogSuccess,
  getProperties,
  getPropertiesSuccess,
  modelUpdateSuccess,
  patchParameters,
} from '@ga/core/store/actions';
import { CalculationParametersState } from '@ga/core/store/models';
import {
  CALCULATION_PARAMETERS_MOCK,
  DIALOG_RESPONSE_MOCK,
  MODEL_MOCK_ID,
  PROPERTIES_MOCK,
} from '@ga/testing/mocks';

import { initialState } from '../../reducers/calculation-parameters/calculation-parameters.reducer';
import { getCalculationParameters } from '../../selectors/calculation-parameters/calculation-parameters.selector';
import { CalculationParametersEffects } from './calculation-parameters.effects';

describe('CalculationParametersEffects', () => {
  let action: any;
  let actions$: any;
  let effects: CalculationParametersEffects;
  let spectator: SpectatorService<CalculationParametersEffects>;
  let restService: RestService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationParametersEffects,
    providers: [
      provideMockActions(() => actions$),
      {
        provide: RestService,
        useValue: {
          putModelUpdate: jest.fn(),
        },
      },
      provideMockStore({
        initialState: {
          parameters: {
            ...initialState,
          },
          bearing: {
            selectedBearing: 'bearingName',
            modelId: MODEL_MOCK_ID,
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CalculationParametersEffects);
    restService = spectator.inject(RestService);
    store = spectator.inject(MockStore);
  });

  describe('updateModel$', () => {
    it(
      'should update the model with the grease params',
      marbles((m) => {
        store.overrideSelector(getCalculationParameters, {
          modelId: MODEL_MOCK_ID,
          options: CALCULATION_PARAMETERS_MOCK,
        });

        const result = modelUpdateSuccess();

        action = patchParameters({
          parameters: initialState as CalculationParametersState,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {});

        const expected = m.cold('--b', { b: result });

        restService.putModelUpdate = jest.fn(() => response);

        m.expect(effects.updateModel$).toBeObservable(expected);
        m.flush();

        expect(restService.putModelUpdate).toHaveBeenCalled();
      })
    );
  });

  describe('properties$', () => {
    it(
      'should fetch grease calculation',
      marbles((m) => {
        const result = getPropertiesSuccess({ properties: PROPERTIES_MOCK });

        action = getProperties();

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: PROPERTIES_MOCK });

        const expected = m.cold('--b', { b: result });

        restService.getProperties = jest.fn(() => response);

        m.expect(effects.properties$).toBeObservable(expected);
        m.flush();

        expect(restService.getProperties).toHaveBeenCalled();
      })
    );
  });

  describe('getDialog$', () => {
    it(
      'should fetch dialog',
      marbles((m) => {
        const result = getDialogSuccess({
          dialogResponse: DIALOG_RESPONSE_MOCK,
        });

        action = getDialog();

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: DIALOG_RESPONSE_MOCK });

        const expected = m.cold('--b', { b: result });

        restService.getDialog = jest.fn(() => response);

        m.expect(effects.getDialog$).toBeObservable(expected);
        m.flush();

        expect(restService.getDialog).toHaveBeenCalled();
      })
    );
  });
});
