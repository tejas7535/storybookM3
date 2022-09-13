/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  addCustomQuickfilter,
  removeCustomQuickfilter,
  setCustomQuickfilter,
  updateCustomQuickfilter,
} from '@mac/msd/store/actions';

export interface QuickFilterState {
  customFilters: QuickFilter[];
}

export const initialState: QuickFilterState = {
  customFilters: [],
};

export const quickFilterReducer = createReducer(
  initialState,
  on(
    setCustomQuickfilter,
    (state, { filters }): QuickFilterState => ({
      ...state,
      customFilters: filters,
    })
  ),

  on(addCustomQuickfilter, (state, { filter }): QuickFilterState => {
    const customFilters = [...state.customFilters];
    customFilters.push(filter);

    return {
      ...state,
      customFilters,
    };
  }),
  on(
    updateCustomQuickfilter,
    (state, { oldFilter, newFilter }): QuickFilterState => {
      const customFilters = [...state.customFilters];
      const index = customFilters.indexOf(oldFilter);
      customFilters[index] = newFilter;

      return {
        ...state,
        customFilters,
      };
    }
  ),
  on(removeCustomQuickfilter, (state, { filter }): QuickFilterState => {
    const customFilters = state.customFilters.filter((val) => val !== filter);

    return {
      ...state,
      customFilters,
    };
  })
);

export function reducer(
  state: QuickFilterState,
  action: Action
): QuickFilterState {
  return quickFilterReducer(state, action);
}
