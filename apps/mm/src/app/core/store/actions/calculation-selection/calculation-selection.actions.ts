import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';
import { createAction, props } from '@ngrx/store';

import { StepConfiguration } from '../../models/calculation-selection-state.model';

export const searchBearingList = createAction(
  '[CalculationSelection] Search Bearing list',
  props<{ query: string }>()
);

export const searchBearingSuccess = createAction(
  '[CalculationSelection] Search Bearing Success',
  props<{ resultList: BearingOption[] }>()
);

export const resetBearing = createAction(
  '[CalculationSelection] Reset Bearing'
);

export const fetchBearingData = createAction(
  '[CalculationSelection] Fetch Bearing data',
  props<{ bearingId: string }>()
);

export const fetchBearingDetails = createAction(
  '[CalculationSelection] Fetch Bearing Details',
  props<{ bearingId: string }>()
);

export const fetchBearingDetailsSuccess = createAction(
  '[CalculationSelection] Fetch Bearing Details Success',
  props<{
    bearingId: string;
    title: string;
    isThermal: boolean;
    isMechanical: boolean;
    isHydraulic: boolean;
  }>()
);

export const fetchBearingDetailsFailure = createAction(
  '[CalculationSelection] Fetch Bearing Details Failure',
  props<{ bearingId: string; error: string }>()
);

export const setBearing = createAction(
  '[CalculationSelection] Set Bearing',
  props<{
    bearingId: string;
    title: string;
    isThermal: boolean;
    isMechanical: boolean;
    isHydraulic: boolean;
  }>()
);

export const setCurrentStep = createAction(
  '[CalculationSelection] Set Current Step',
  props<{ step: number; isBackNavigation?: boolean }>()
);

export const fetchBearingSeats = createAction(
  '[CalculationSelection] Fetch bearing seats'
);

export const setBearingSeats = createAction(
  '[CalculationSelection] Set bearing seats',
  props<{ bearingSeats: ListValue[] }>()
);

export const setBearingSeat = createAction(
  '[CalculationSelection] Set Bearing Seat',
  props<{ bearingSeatId: string }>()
);

export const fetchMeasurementMethods = createAction(
  '[CalculationSelection] Fetch measurement methods'
);

export const setMeasurementMethods = createAction(
  '[CalculationSelection] Set measurement methods',
  props<{ measurementMethods: ListValue[] }>()
);

export const setMeasurementMethod = createAction(
  '[CalculationSelection] Set Measurement Method',
  props<{ measurementMethod: string }>()
);

export const fetchMountingMethods = createAction(
  '[CalculationSelection] Fetch mounting methods'
);

export const setMountingMethods = createAction(
  '[CalculationSelection] Set mounting methods',
  props<{ mountingMethods: ListValue[] }>()
);

export const updateMountingMethodAndCurrentStep = createAction(
  '[CalculationSelection] Update Mounting Method and Current Step',
  props<{ mountingMethod: string }>()
);

export const setMountingMethod = createAction(
  '[CalculationSelection] Set Mounting Method',
  props<{ mountingMethod: string }>()
);

export const fetchPreflightOptions = createAction(
  '[CalculationSelection] Fetch preflight options'
);

export const setPreflightOptions = createAction(
  '[CalculationSelection] set preflight options'
);

export const updateStepConfiguration = createAction(
  '[CalculationSelection] Update Step Configuration',
  props<{ stepConfiguration: StepConfiguration }>()
);
