import { of } from 'rxjs';

import { marbles } from 'rxjs-marbles';

import { CalculationParametersState } from '@ga/core/store/models';
import { Grease } from '@ga/shared/services/greases/greases.service';
import {
  CALCULATION_PARAMETERS_MOCK,
  DIALOG_RESPONSE_MOCK,
  MODEL_MOCK_ID,
  PROPERTIES_MOCK,
} from '@ga/testing/mocks';

import { CalculationParametersActions } from '../../actions';
import { initialState } from '../../reducers/calculation-parameters/calculation-parameters.reducer';
import { getModelId } from '../../selectors/bearing-selection/bearing-selection.selector';
import * as Effects from './calculation-parameters.effects';

describe('CalculationParametersEffects', () => {
  describe('updateModel$', () => {
    it(
      'should update the model with the grease params',
      marbles((m) => {
        const storeMock = {
          select: jest.fn(() =>
            of({
              modelId: MODEL_MOCK_ID,
              options: CALCULATION_PARAMETERS_MOCK,
            })
          ),
        };

        const restServiceMock = {
          putModelUpdate: jest.fn(() => m.cold('-a|', {})),
        };

        const action = CalculationParametersActions.patchParameters({
          parameters: initialState as CalculationParametersState,
        });

        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.modelUpdateSuccess(),
        });

        const result = Effects.updateModel$(
          actions$,
          restServiceMock as any,
          storeMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(restServiceMock.putModelUpdate).toHaveBeenCalled();
      })
    );
  });

  describe('properties$', () => {
    it(
      'should fetch grease calculation',
      marbles((m) => {
        const storeMock = {
          select: jest.fn(() => of(MODEL_MOCK_ID)),
        };

        const restServiceMock = {
          getProperties: jest.fn(() => m.cold('-a|', { a: PROPERTIES_MOCK })),
        };

        const action = CalculationParametersActions.getProperties();

        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.getPropertiesSuccess({
            properties: PROPERTIES_MOCK,
          }),
        });

        const result = Effects.properties$(
          actions$,
          restServiceMock as any,
          storeMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(restServiceMock.getProperties).toHaveBeenCalled();
      })
    );
  });

  describe('getDialog$', () => {
    it(
      'should fetch dialog',
      marbles((m) => {
        const storeMock = {
          select: jest.fn((selector) =>
            selector === getModelId ? of(MODEL_MOCK_ID) : of([])
          ),
        };

        const restServiceMock = {
          getDialog: jest.fn(() => m.cold('-a|', { a: DIALOG_RESPONSE_MOCK })),
        };

        const action = CalculationParametersActions.getDialog();

        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.getDialogSuccess({
            dialogResponse: DIALOG_RESPONSE_MOCK,
          }),
        });

        const result = Effects.getDialog$(
          actions$,
          restServiceMock as any,
          storeMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(restServiceMock.getDialog).toHaveBeenCalled();
      })
    );

    it(
      'should dispatch getDialogFailure on error',
      marbles((m) => {
        const storeMock = {
          select: jest.fn((selector) =>
            selector === getModelId ? of(MODEL_MOCK_ID) : of([])
          ),
        };

        const restServiceMock = {
          getDialog: jest.fn(() => m.cold('-#|', {}, new Error('fail'))),
        };

        const action = CalculationParametersActions.getDialog();
        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.getDialogFailure(),
        });

        const result = Effects.getDialog$(
          actions$,
          restServiceMock as any,
          storeMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();
        expect(restServiceMock.getDialog).toHaveBeenCalled();
      })
    );
  });

  describe('loadCompetitorsGreases$', () => {
    it(
      'should load competitors greases',
      marbles((m) => {
        const mockGreases = [{ name: 'test' } as Partial<Grease> as Grease];

        const greasesProviderMock = {
          fetchAllGreases: jest.fn(() => m.cold('-a|', { a: mockGreases })),
        };

        const action = CalculationParametersActions.loadCompetitorsGreases();

        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.loadCompetitorsGreasesSuccess({
            greases: mockGreases.map((grease) => ({
              ...grease,
              isGrease: true,
            })),
          }),
        });

        const result = Effects.loadCompetitorsGreases$(
          actions$,
          greasesProviderMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(greasesProviderMock.fetchAllGreases).toHaveBeenCalled();
      })
    );

    it(
      'should dispatch loadCompetitorsGreasesFailure on error',
      marbles((m) => {
        const greasesProviderMock = {
          fetchAllGreases: jest.fn(() => m.cold('-#|', {}, new Error('fail'))),
        };

        const action = CalculationParametersActions.loadCompetitorsGreases();
        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.loadCompetitorsGreasesFailure(),
        });

        const result = Effects.loadCompetitorsGreases$(
          actions$,
          greasesProviderMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();
        expect(greasesProviderMock.fetchAllGreases).toHaveBeenCalled();
      })
    );
  });

  describe('loadSchaefflerGreases$', () => {
    it(
      'should load schaeffler greases',
      marbles((m) => {
        const mockGreases = [{ name: 'test' } as Partial<Grease> as Grease];

        const greasesProviderMock = {
          fetchAllSchaefflerGreases: jest.fn(() =>
            m.cold('-a|', { a: mockGreases })
          ),
        };

        const action = CalculationParametersActions.loadSchaefflerGreases();

        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.loadSchaefflerGreasesSuccess({
            greases: mockGreases.map((grease) => ({
              ...grease,
              isGrease: true,
            })),
          }),
        });

        const result = Effects.loadSchaefflerGreases$(
          actions$,
          greasesProviderMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(
          greasesProviderMock.fetchAllSchaefflerGreases
        ).toHaveBeenCalled();
      })
    );

    it(
      'should dispatch loadSchaefflerGreasesFailure on error',
      marbles((m) => {
        const greasesProviderMock = {
          fetchAllSchaefflerGreases: jest.fn(() =>
            m.cold('-#|', {}, new Error('fail'))
          ),
        };

        const action = CalculationParametersActions.loadSchaefflerGreases();
        const actions$ = m.hot('-a', { a: action });

        const expected = m.cold('--b', {
          b: CalculationParametersActions.loadSchaefflerGreasesFailure(),
        });

        const result = Effects.loadSchaefflerGreases$(
          actions$,
          greasesProviderMock as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();
        expect(
          greasesProviderMock.fetchAllSchaefflerGreases
        ).toHaveBeenCalled();
      })
    );
  });
});
