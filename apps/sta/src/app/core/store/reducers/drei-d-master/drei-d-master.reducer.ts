import { Action, createReducer, on } from '@ngrx/store';

import { TextInput } from '../../../../shared/result/models/text-input.model';
import {
  loadClassificationForText,
  loadClassificationForTextFailure,
  loadClassificationForTextSuccess,
  resetClassifications,
} from '../../actions/drei-d-master/dreid-d-master.actions';
import { ClassificationText } from '../../reducers/drei-d-master/models/classification-for-text.model';

export interface DreiDMasterState {
  classificationTextInput: TextInput;
  classificationForText: ClassificationText;
}

export const initialState: DreiDMasterState = {
  classificationTextInput: undefined,
  classificationForText: undefined,
};

export const dreiDMasterReducer = createReducer(
  initialState,
  on(loadClassificationForText, (state: DreiDMasterState, { textInput }) => ({
    ...state,
    classificationTextInput: textInput,
    classificationForText: {
      ...state.classificationForText,
      loading: true,
    },
  })),
  on(
    loadClassificationForTextSuccess,
    (state: DreiDMasterState, { classification }) => ({
      ...state,
      classificationForText: {
        categories: classification.categories,
        probabilities: classification.probabilities,
        loading: false,
      },
    })
  ),
  on(loadClassificationForTextFailure, (state: DreiDMasterState) => ({
    ...state,
    classificationForText: {
      ...state.classificationForText,
      loading: false,
    },
  })),
  on(resetClassifications, () => ({
    ...initialState,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: DreiDMasterState,
  action: Action
): DreiDMasterState {
  return dreiDMasterReducer(state, action);
}
