import { createSelector } from '@ngrx/store';

import { getDreiDMasterState } from '../../reducers';
import { DreiDMasterState } from '../../reducers/drei-d-master/drei-d-master.reducer';

export const getClassificationTextInput = createSelector(
  getDreiDMasterState,
  (state: DreiDMasterState) => state.classificationTextInput
);

export const getClassificationForText = createSelector(
  getDreiDMasterState,
  (state: DreiDMasterState) => state.classificationForText
);
