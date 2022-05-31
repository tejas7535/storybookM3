import { createAction, props } from '@ngrx/store';

import {
  BearingSelectionTypeUnion,
  ExtendedSearchParameters,
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

export const searchBearingExtended = createAction(
  '[Bearing] Search Bearing Extended',
  props<{ parameters: ExtendedSearchParameters }>()
);

export const bearingSearchExtendedSuccess = createAction(
  '[Bearing] Search Bearing Extended Success',
  props<{ resultList: string[] }>()
);

export const bearingSearchExtendedFailure = createAction(
  '[Bearing] Search Bearing Extended Failure'
);

export const searchBearingExtendedCount = createAction(
  '[Bearing] Search Bearing Extended Count',
  props<{ parameters: ExtendedSearchParameters }>()
);

export const bearingSearchExtendedCountSuccess = createAction(
  '[Bearing] Search Bearing Extended Count Success',
  props<{ resultsCount: number }>()
);

export const bearingSearchExtendedCountFailure = createAction(
  '[Bearing] Search Bearing Extended Count Failure'
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
