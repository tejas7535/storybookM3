import { createAction, props, union } from '@ngrx/store';

export const loadAvailableCurrenciesSuccess = createAction(
  '[Currency] Load available currencies Success',
  props<{ currencies: string[] }>()
);

export const loadAvailableCurrenciesFailure = createAction(
  '[Currency] Load available currencies failed',
  props<{ errorMessage: string }>()
);

const all = union({
  loadAvailableCurrenciesSuccess,
  loadAvailableCurrenciesFailure,
});

export type currencyActions = typeof all;
