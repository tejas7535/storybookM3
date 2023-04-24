import { createAction, props } from '@ngrx/store';

import { BasicFrequenciesResult } from '../../models';

export const setCalculationFailure = createAction(
  '[Catalog Calculation Result] Set Calculation Failure',
  props<{ error: string }>()
);

export const fetchBasicFrequencies = createAction(
  '[Catalog Calculation Result] Fetch Basic Frequencies'
);

export const setBasicFrequenciesResult = createAction(
  '[Catalog Calculation Result] Set Basic Frequencies Result',
  props<{ basicFrequenciesResult: BasicFrequenciesResult }>()
);

export const downloadBasicFrequencies = createAction(
  '[Catalog Calculation Result] Download Basic Frequencies'
);
