import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { CalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';

import { CalculationOptionsActions } from '../../actions';
import { CalculationOptionsState } from '../../models/calculation-options-state.model';
import {
  calculationOptionsReducer,
  initialState,
} from './calculation-options.reducer';

describe('Calculation Options Reducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown' } as any;
    const state = calculationOptionsReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  it('should set calculation options on setCalculationOptions', () => {
    const options: PreflightData = {
      innerRingExpansion: '123',
    } as Partial<PreflightData> as PreflightData;
    const action = CalculationOptionsActions.setCalculationOptions({ options });
    const state = calculationOptionsReducer(initialState, action);
    expect(state.options).toEqual(options);
  });

  it('should update options from form data on updateOptionsFromFormData', () => {
    const formData = {
      mountingOption: 'newMountingOption',
      hydraulicNutType: 'newHydraulicNutType',
      innerRingExpansion: 'newInnerRingExpansion',
      previousMountingOption: 'newPreviousMountingOption',
      radialClearanceReduction: 'newRadialClearanceReduction',
    } as CalculationOptionsFormData;
    const action = CalculationOptionsActions.updateOptionsFromFormData({
      formData,
    });

    const stateWithOptions: CalculationOptionsState = {
      options: {
        ...initialState.options,
        hudraulicNutType: {
          value: undefined,
          options: [],
        },
      },
      thermalOptions: undefined,
      calculationPerformed: false,
    };

    const state = calculationOptionsReducer(stateWithOptions, action);
    expect(state.options.mountingOption).toEqual(formData.mountingOption);
    expect(state.options.hudraulicNutType.value).toEqual(
      formData.hydraulicNutType
    );

    expect(state.options.innerRingExpansion).toEqual(
      formData.innerRingExpansion
    );
    expect(state.options.numberOfPreviousMountings).toEqual(
      formData.previousMountingOption
    );
    expect(state.options.radialClearanceReduction).toEqual(
      formData.radialClearanceReduction
    );
  });

  it('should set shaft material information on setShaftMaterialInformation', () => {
    const shaftMaterialData = {
      id: 'newShaftMaterial',
      emodul: 'newModulusOfElasticity',
      nue: 'newPoissonRatio',
    };
    const action = CalculationOptionsActions.setShaftMaterialInformation({
      shaftMaterialData,
    });
    const state = calculationOptionsReducer(initialState, action);
    expect(state.options.shaftMaterial).toEqual(shaftMaterialData.id);
    expect(state.options.modulusOfElasticity).toEqual(shaftMaterialData.emodul);
    expect(state.options.poissonRatio).toEqual(shaftMaterialData.nue);
  });

  it('should set calculationPerformed on setCalculationPerformed', () => {
    const action = CalculationOptionsActions.setCalculationPerformed({
      performed: false,
    });
    const state = calculationOptionsReducer(initialState, action);
    expect(state.calculationPerformed).toBe(false);

    const actionTrue = CalculationOptionsActions.setCalculationPerformed({
      performed: true,
    });
    const stateWithPerformedTrue = {
      ...initialState,
      calculationPerformed: true,
    };
    const updatedState = calculationOptionsReducer(
      stateWithPerformedTrue,
      actionTrue
    );
    expect(updatedState.calculationPerformed).toBe(true);
  });

  it('should reset calculationPerformed to false when updating options from form data', () => {
    const stateWithCalculationPerformed: CalculationOptionsState = {
      options: {
        ...initialState.options,
        hudraulicNutType: {
          value: 'oldValue',
          options: [],
        },
      },
      thermalOptions: undefined,
      calculationPerformed: true,
    };

    const formData = {
      mountingOption: 'newMountingOption',
      hydraulicNutType: 'newHydraulicNutType',
    } as any;

    const action = CalculationOptionsActions.updateOptionsFromFormData({
      formData,
    });
    const state = calculationOptionsReducer(
      stateWithCalculationPerformed,
      action
    );

    expect(state.calculationPerformed).toBe(false);
  });

  it('should set tolerance classes on setToleranceClasses', () => {
    const toleranceClasses = ['class1', 'class2'];
    const action = CalculationOptionsActions.setToleranceClasses({
      toleranceClasses,
    });
    const state = calculationOptionsReducer(initialState, action);
    expect(state.toleranceClasses).toEqual(toleranceClasses);
  });

  it('should update thermal options from form data on updateThermalOptionsFromFormData', () => {
    const formData = {
      upperDeviation: 1,
      lowerDeviation: 1,
      toleranceClass: 'j6',
      temperature: 21,
    } as any;

    const action = CalculationOptionsActions.updateThermalOptionsFromFormData({
      formData,
    });

    const stateWithThermalOptions: CalculationOptionsState = {
      options: initialState.options,
      thermalOptions: {
        upperDeviation: 0,
        lowerDeviation: 0,
        toleranceClass: 'none',
        temperature: 20,
      },
      calculationPerformed: false,
    };

    const state = calculationOptionsReducer(stateWithThermalOptions, action);
    expect(state.thermalOptions).toEqual(formData);
  });

  it('should reset state to initialState on resetCalculationOptions', () => {
    const modifiedState: CalculationOptionsState = {
      options: { innerRingExpansion: 'changed' } as any,
      thermalOptions: { upperDeviation: 99 } as any,
      calculationPerformed: true,
    };
    const action = CalculationOptionsActions.resetCalculationOptions();
    const state = calculationOptionsReducer(modifiedState, action);
    expect(state).toEqual(initialState);
  });
});
