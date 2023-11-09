import { createAction, props } from '@ngrx/store';

import { BasicFrequenciesResult, CatalogCalculationResult } from '../../models';

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

export const fetchCalculationResult = createAction(
  '[Catalog Calculation Result] Fetch Calculation Result'
);

export const setCalculationResult = createAction(
  '[Catalog Calculation Result] Set Calculation Result',
  props<{ calculationResult: CatalogCalculationResult }>()
);

export const resetCalculationResult = createAction(
  '[Catalog Calculation Result] Reset Calculation Result'
);
