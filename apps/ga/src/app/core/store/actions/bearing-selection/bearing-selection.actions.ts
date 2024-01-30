import { createAction, props } from '@ngrx/store';

import {
  AdvancedBearingSelectionFilters,
  BearingInfo,
  BearingSelectionTypeUnion,
} from '@ga/shared/models';

export const setBearingSelectionType = createAction(
  '[Bearing Selection] Set Bearing Selection Type',
  props<{ bearingSelectionType: BearingSelectionTypeUnion }>()
);

export const searchBearing = createAction(
  '[Bearing Selection] Search Bearing',
  props<{ query: string }>()
);

export const bearingSearchSuccess = createAction(
  '[Bearing Selection] Search Bearing Success',
  props<{ resultList: BearingInfo[] }>()
);

// todo bearingSearchFailure

export const searchBearingForAdvancedSelection = createAction(
  '[Bearing Selection] Search Bearing For Advanced Selection',
  props<{ selectionFilters: AdvancedBearingSelectionFilters }>()
);

export const advancedBearingSelectionSuccess = createAction(
  '[Bearing Selection] Search Bearing For Advanced Selection Success',
  props<{ resultList: BearingInfo[] }>()
);

export const advancedBearingSelectionFailure = createAction(
  '[Bearing Selection] Search Bearing For Advanced Selection Failure'
);

export const searchBearingForAdvancedSelectionCount = createAction(
  '[Bearing Selection] Search Bearing For Advanced Selection Count',
  props<{ selectionFilters: AdvancedBearingSelectionFilters }>()
);

export const advancedBearingSelectionCountSuccess = createAction(
  '[Bearing Selection] Search Bearing For Advanced Selection Count Success',
  props<{ resultsCount: number }>()
);

export const advancedBearingSelectionCountFailure = createAction(
  '[Bearing Selection] Search Bearing For Advanced Selection Count Failure'
);

export const modelCreateSuccess = createAction(
  '[Bearing Selection] Model Create Success',
  props<{ modelId: string }>()
);

export const modelCreateFailure = createAction(
  '[Bearing Selection] Model Create Failure'
);

export const selectBearing = createAction(
  '[Bearing Selection] Select Bearing',
  props<{ bearing: string }>()
);

export const resetBearing = createAction('[Bearing Selection] Reset Bearing');
