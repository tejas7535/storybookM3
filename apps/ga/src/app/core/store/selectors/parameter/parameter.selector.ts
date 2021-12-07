import { createSelector } from '@ngrx/store';

import {
  CalculationParamters,
  InstallationMode,
  LoadInstallation,
  Property,
} from '../../../../shared/models';
import { getModelId, getSelectedBearing } from '..';
import { getParameterState } from './../../reducers';
import { ParameterState } from './../../reducers/parameter/parameter.reducer';

interface LoadDirection {
  [key: string]: boolean;
}

export const getSelectedMovementType = createSelector(
  getParameterState,
  (state: ParameterState): string => state.movements.type
);

export const getEnvironmentTemperatures = createSelector(
  getParameterState,
  (
    state: ParameterState
  ): { operatingTemperature: number; environmentTemperature: number } => ({
    operatingTemperature: state.environment.operatingTemperature,
    environmentTemperature: state.environment.environmentTemperature,
  })
);

export const getLoadsInputType = createSelector(
  getParameterState,
  (state: ParameterState): boolean => state.loads.exact
);

export const getParameterValidity = createSelector(
  getParameterState,
  (state: ParameterState): boolean => state?.valid
);

export const getParameterUpdating = createSelector(
  getParameterState,
  (state: ParameterState): boolean => state?.updating
);

export const getProperties = createSelector(
  getParameterState,
  (state: ParameterState): Property[] => state?.properties as Property[]
);

export const getLoadDirections = createSelector(
  getProperties,
  (properties: Property[]): LoadDirection =>
    properties
      ?.filter(({ name }: Property) =>
        Object.values(LoadInstallation).includes(name as LoadInstallation)
      )
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((loadDirections: LoadDirection, property: Property) => {
        loadDirections[property.name] =
          property.value === InstallationMode.fixed;

        return loadDirections;
      }, {})
);

export const axialLoadPossible = createSelector(
  getLoadDirections,
  (loadDirections: LoadDirection): boolean =>
    loadDirections &&
    (loadDirections[LoadInstallation.positiveAxial] ||
      loadDirections[LoadInstallation.negativeAxial])
);

export const radialLoadPossible = createSelector(
  getLoadDirections,
  (loadDirections: LoadDirection): boolean =>
    loadDirections && loadDirections[LoadInstallation.radial]
);

export const getCalculationParameters = createSelector(
  getParameterState,
  getSelectedBearing,
  getModelId,
  (
    state: ParameterState,
    bearing: string,
    modelId: string
  ): { modelId: string; options: CalculationParamters } => {
    const oscillating = state.movements.shiftAngle &&
      state.movements.shiftFrequency && {
        idlC_OSCILLATION_ANGLE: `${state.movements.shiftAngle.toFixed(1)}`,
        idlC_MOVEMENT_FREQUENCY: `${state.movements.shiftFrequency.toFixed(1)}`,
      };

    const rotating = state.movements.rotationalSpeed && {
      idL_RELATIVE_SPEED_WITHOUT_SIGN: `${state.movements.rotationalSpeed.toFixed(
        1
      )}`,
    };

    return (
      state &&
      state?.valid &&
      bearing &&
      modelId && {
        modelId,
        options: {
          idcO_DESIGNATION: `${bearing}`,
          idlC_TYPE_OF_MOVEMENT: state.movements.type,
          idcO_RADIAL_LOAD: `${(state.loads.radial || 0).toFixed(1)}`,
          idcO_AXIAL_LOAD: `${(state.loads.axial || 0).toFixed(1)}`,
          idscO_OILTEMP: `${state.environment.operatingTemperature.toFixed(1)}`,
          idslC_TEMPERATURE: `${state.environment.environmentTemperature.toFixed(
            1
          )}`,
          idscO_INFLUENCE_OF_AMBIENT: state.environment.environmentImpact,
          ...rotating,
          ...oscillating,
        },
      }
    );
  }
);
