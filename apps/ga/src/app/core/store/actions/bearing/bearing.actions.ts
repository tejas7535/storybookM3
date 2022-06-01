import { createAction, props } from '@ngrx/store';

import {
  BearingSelectionTypeUnion,
  AdvancedBearingSelectionFilters,
} from '@ga/shared/models';

export const setBearingSelectionType = createAction(
  '[Bearing] Set Bearing Selection Type',
  props<{ bearingSelectionType: BearingSelectionTypeUnion }>()
);

export const searchBearing = createAction(
  '[Bearing] Search Bearing',
  props<{ query: string }>()
);

export const bearingSearchSuccess = createAction(
  '[Bearing] Search Bearing Success',
  props<{ resultList: string[] }>()
);

// todo bearingSearchFailure

export const searchBearingForAdvancedSelection = createAction(
  '[Bearing] Search Bearing For Advanced Selection',
  props<{ selectionFilters: AdvancedBearingSelectionFilters }>()
);

export const advancedBearingSelectionSuccess = createAction(
  '[Bearing] Search Bearing For Advanced Selection Success',
  props<{ resultList: string[] }>()
);

export const advancedBearingSelectionFailure = createAction(
  '[Bearing] Search Bearing For Advanced Selection Failure'
);

export const searchBearingForAdvancedSelectionCount = createAction(
  '[Bearing] Search Bearing For Advanced Selection Count',
  props<{ selectionFilters: AdvancedBearingSelectionFilters }>()
);

export const advancedBearingSelectionCountSuccess = createAction(
  '[Bearing] Search Bearing For Advanced Selection Count Success',
  props<{ resultsCount: number }>()
);

export const advancedBearingSelectionCountFailure = createAction(
  '[Bearing] Search Bearing For Advanced Selection Count Failure'
);

export const modelCreateSuccess = createAction(
  '[Bearing] Model Create Success',
  props<{ modelId: string }>()
);

export const modelCreateFailure = createAction(
  '[Bearing] Model Create Failure'
);

export const selectBearing = createAction(
  '[Bearing] Select Bearing',
  props<{ bearing: string }>()
);
