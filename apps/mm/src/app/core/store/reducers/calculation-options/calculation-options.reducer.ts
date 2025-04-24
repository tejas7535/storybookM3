import { createReducer, on } from '@ngrx/store';

import { CalculationOptionsActions } from '../../actions';
import { CalculationOptionsState } from '../../models/calculation-options-state.model';

export const initialState: CalculationOptionsState = {
  options: undefined,
  calculationPerformed: false,
};

export const calculationOptionsReducer = createReducer(
  initialState,
  on(
    CalculationOptionsActions.setCalculationOptions,
    (state, { options }): CalculationOptionsState => ({
      ...state,
      options,
    })
  ),
  on(
    CalculationOptionsActions.setCalculationPerformed,
    (state, { performed }): CalculationOptionsState => ({
      ...state,
      calculationPerformed: performed,
    })
  ),
  on(
    CalculationOptionsActions.updateOptionsFromFormData,
    (state, { formData }): CalculationOptionsState => ({
      ...state,
      options: {
        ...state.options,
        mountingOption: formData.mountingOption,
        hudraulicNutType: {
          ...state.options.hudraulicNutType,
          value: formData.hydraulicNutType,
        },
        innerRingExpansion:
          formData.innerRingExpansion ?? state.options.innerRingExpansion,
        numberOfPreviousMountings: formData.previousMountingOption,
        radialClearanceReduction:
          formData.radialClearanceReduction ??
          state.options.radialClearanceReduction,
        shaftDiameter: formData.shaftDiameter ?? state.options.shaftDiameter,
      },
      calculationPerformed: false,
    })
  ),
  on(
    CalculationOptionsActions.setShaftMaterialInformation,
    (state, { shaftMaterialData }): CalculationOptionsState => ({
      ...state,
      options: {
        ...state.options,
        shaftMaterial: shaftMaterialData.id,
        modulusOfElasticity: shaftMaterialData.emodul,
        poissonRatio: shaftMaterialData.nue,
      },
    })
  )
);
