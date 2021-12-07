import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  CALCULATION_PARAMETERS_MOCK,
  MODEL_MOCK_ID,
} from '../../../../../testing/mocks/rest.service.mock';
import { RestService } from '../../../services/rest/rest.service';
import {
  modelUpdateSuccess,
  patchParameters,
} from '../../actions/parameters/parameters.actions';
import {
  initialState,
  ParameterState,
} from '../../reducers/parameter/parameter.reducer';
import { getCalculationParameters } from '../../selectors/parameter/parameter.selector';
import { ParameterEffects } from './parameter.effects';

describe('Parameter Effects', () => {
  let action: any;
  let actions$: any;
  let effects: ParameterEffects;
  let spectator: SpectatorService<ParameterEffects>;
  let restService: RestService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: ParameterEffects,
    imports: [RouterTestingModule],
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
    effects = spectator.inject(ParameterEffects);
    store = spectator.inject(MockStore);
    restService = spectator.inject(RestService);
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
          parameters: initialState as ParameterState,
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
});
