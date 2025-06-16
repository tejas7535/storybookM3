import { Action } from '@ngrx/store';

import { CalculationParametersActions } from '@ga/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { CalculationParametersState } from '@ga/core/store/models';
import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import { EnvironmentImpact, LoadLevels, Movement } from '@ga/shared/models';
import {
  AUTOMATIC_LUBRICATON_MOCK,
  DIALOG_RESPONSE_MOCK,
  PREFERRED_GREASE_MOCK,
  PREFERRED_GREASE_OPTION_MOCK,
  PROPERTIES_MOCK,
} from '@ga/testing/mocks';

import {
  calculationParametersReducer,
  initialState,
  reducer,
} from './calculation-parameters.reducer';

describe('calculationParametersReducer', () => {
  describe('Reducer function', () => {
    it('should return calculationParametersReducer', () => {
      // Create an action that doesn't rely on parameters
      const action: Action = CalculationParametersActions.modelUpdateSuccess();
      expect(reducer(initialState, action)).toEqual(
        calculationParametersReducer(initialState, action)
      );
    });
  });

  describe('patchParameters Action', () => {
    it('should patch all parameters', () => {
      const mockParameters: CalculationParametersState = {
        loads: {
          radial: 10,
          axial: 10,
          exact: false,
          loadRatio: LoadLevels.LB_MODERATE,
        },
        movements: {
          type: Movement.oscillating,
          rotationalSpeed: 10,
          shiftFrequency: 10,
          shiftAngle: 10,
        },
        environment: {
          operatingTemperature: 170,
          environmentTemperature: 120,
          environmentImpact: EnvironmentImpact.moderate,
          applicationScenario: ApplicationScenario.All,
        },
        preferredGrease: PREFERRED_GREASE_MOCK,
        competitorsGreases: [],
        schaefflerGreases: [],
        automaticLubrication: true,
        valid: true,
        updating: false,
        properties: undefined,
      };

      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.patchParameters({
          parameters: mockParameters,
        })
      );

      expect(newState).toEqual({ ...mockParameters, updating: true });
    });

    it('should patch partial parameters', () => {
      const mockParameters: CalculationParametersState = {
        loads: {
          radial: 10,
          axial: 10,
        },
        environment: {
          operatingTemperature: 100,
        },
        movements: {
          rotationalSpeed: 20,
        },
      } as CalculationParametersState;

      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.patchParameters({
          parameters: mockParameters,
        })
      );

      expect(newState.loads.axial).toEqual(10);
      expect(newState.loads.radial).toEqual(10);
      // Verify environment merge works
      expect(newState.environment.operatingTemperature).toEqual(100);
      expect(newState.environment.environmentImpact).toEqual(
        initialState.environment.environmentImpact
      );
      // Verify movements merge works
      expect(newState.movements.rotationalSpeed).toEqual(20);
      expect(newState.movements.type).toEqual(initialState.movements.type);
      expect(newState.updating).toEqual(true);
    });
  });

  describe('modelUpdateSuccess Action', () => {
    it('should set updating to false when params are updated', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.modelUpdateSuccess()
      );

      expect(newState).toEqual({ ...initialState, updating: false });
    });
  });

  describe('getPropertiesSuccess Action', () => {
    it('should set the properties for the model', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.getPropertiesSuccess({
          properties: PROPERTIES_MOCK,
        })
      );

      expect(newState).toEqual({
        ...initialState,
        properties: PROPERTIES_MOCK,
      });
    });
  });

  describe('getDialog', () => {
    it('should set loading to true', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.getDialog()
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...initialState.preferredGrease,
          loading: true,
        },
      });
    });
  });

  describe('getDialogSuccess', () => {
    it('should set preferred grease', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.getDialogSuccess({
          dialogResponse: DIALOG_RESPONSE_MOCK,
        })
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...PREFERRED_GREASE_MOCK,
          selectedGrease: undefined,
        },
      });
    });
  });

  describe('getDialogFailure', () => {
    it('should set loading to false', () => {
      const newState = calculationParametersReducer(
        {
          ...initialState,
          preferredGrease: {
            ...initialState.preferredGrease,
            loading: true,
          },
        },
        CalculationParametersActions.getDialogFailure()
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...initialState.preferredGrease,
          loading: false,
        },
      });
    });
  });

  describe('setPreferredGreaseSelection', () => {
    it('should set preferred grease selection', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.setPreferredGreaseSelection({
          selectedGrease: PREFERRED_GREASE_OPTION_MOCK,
        })
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...initialState.preferredGrease,
          selectedGrease: PREFERRED_GREASE_OPTION_MOCK,
        },
      });
    });
  });

  describe('resetPreferredGreaseSelection', () => {
    it('should reset preferred grease selection', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.resetPreferredGreaseSelection()
      );

      expect(newState).toEqual(initialState);
    });
  });

  describe('setAutomaticLubrication', () => {
    it('should set the automatic Lubrication boolean value', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.setAutomaticLubrication({
          automaticLubrication: AUTOMATIC_LUBRICATON_MOCK,
        })
      );

      expect(newState).toEqual({
        ...initialState,
        automaticLubrication: AUTOMATIC_LUBRICATON_MOCK,
      });
    });
  });

  describe('loadCompetitorsGreasesSuccess', () => {
    it('should set competitors greases', () => {
      const mockGreases = [
        {
          id: '1',
          name: 'Competitor Grease 1',
          company: 'Competitor Co',
          mixableGreases: [] as string[],
        },
        {
          id: '2',
          name: 'Competitor Grease 2',
          company: 'Competitor Co',
          mixableGreases: [] as string[],
        },
      ];
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.loadCompetitorsGreasesSuccess({
          greases: mockGreases as any[],
        })
      );

      expect(newState).toEqual({
        ...initialState,
        competitorsGreases: mockGreases,
      });
    });
  });

  describe('loadSchaefflerGreasesSuccess', () => {
    it('should set Schaeffler greases', () => {
      const mockGreases = [
        {
          id: '1',
          name: 'Schaeffler Grease 1',
          company: 'Schaeffler',
          mixableGreases: [] as string[],
        },
        {
          id: '2',
          name: 'Schaeffler Grease 2',
          company: 'Schaeffler',
          mixableGreases: [] as string[],
        },
      ];
      const newState = calculationParametersReducer(
        initialState,
        CalculationParametersActions.loadSchaefflerGreasesSuccess({
          greases: mockGreases as any[],
        })
      );

      expect(newState).toEqual({
        ...initialState,
        schaefflerGreases: mockGreases,
      });
    });
  });
});
