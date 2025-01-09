import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/lazy-list-loader/mm-list-value.model';
import { createAction, props } from '@ngrx/store';

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

export const setBearing = createAction(
  '[CalculationSelection] Set Bearing',
  props<{ bearingId: string; title: string }>()
);

export const setBearingType = createAction(
  '[CalculationSelection] Set Bearing Type',
  props<{ typeId: string; title: string }>()
);

export const setBearingSeries = createAction(
  '[CalculationSelection] Set Bearing Series',
  props<{ seriesId: string; title: string }>()
);

export const setCurrentStep = createAction(
  '[CalculationSelection] Set Current Step',
  props<{ step: number }>()
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
