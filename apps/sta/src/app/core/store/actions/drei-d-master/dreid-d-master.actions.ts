import { createAction, props, union } from '@ngrx/store';

import { Classification } from '../../../../shared/result/models';
import { TextInput } from '../../../../shared/result/models/text-input.model';

export const loadClassificationForText = createAction(
  '[Classification] Load Classification for Text',
  props<{ textInput: TextInput }>()
);
export const loadClassificationForTextSuccess = createAction(
  '[Classification] Load Classification for Text Success',
  props<{ classification: Classification }>()
);
export const loadClassificationForTextFailure = createAction(
  '[Classification] Load Classification for Text Failure'
);

export const resetClassifications = createAction(
  '[Classification] Reset All Classifications'
);

const all = union({
  loadClassificationForText,
  loadClassificationForTextSuccess,
  loadClassificationForTextFailure,
  resetClassifications,
});

export type ClassificationActions = typeof all;
