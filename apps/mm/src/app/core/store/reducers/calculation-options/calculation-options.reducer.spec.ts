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
});
