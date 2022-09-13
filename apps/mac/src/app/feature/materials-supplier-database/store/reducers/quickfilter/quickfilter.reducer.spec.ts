import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import * as QuickfilterActions from '@mac/msd/store/actions/quickfilter';

import {
  initialState,
  quickFilterReducer,
  QuickFilterState,
} from './quickfilter.reducer';

describe('quickfilterReducer', () => {
  const quickfilter: QuickFilter = {
    title: 'title',
    columns: ['1', '2'],
    filter: {},
    custom: true,
  };
  const second: QuickFilter = {
    title: 'second',
    columns: [],
    filter: {},
    custom: false,
  };
  describe('reducer', () => {
    let state: QuickFilterState;

    beforeEach(() => {
      state = initialState;
    });

    it('should return initial state', () => {
      const action: any = {};
      const newState = quickFilterReducer(undefined, action);

      expect(newState).toEqual(initialState);
    });

    it('should add a custom quickfilter', () => {
      const action = QuickfilterActions.addCustomQuickfilter({
        filter: quickfilter,
      });
      const newState = quickFilterReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        customFilters: [quickfilter],
      });
    });
    it('should set initial list of quickfilters', () => {
      const action = QuickfilterActions.setCustomQuickfilter({
        filters: [quickfilter],
      });
      const newState = quickFilterReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        customFilters: [quickfilter],
      });
    });
    it('should remove a quickfilter', () => {
      const action1 = QuickfilterActions.setCustomQuickfilter({
        filters: [quickfilter, second],
      });
      state = quickFilterReducer(state, action1);
      const action2 = QuickfilterActions.removeCustomQuickfilter({
        filter: quickfilter,
      });
      const newState = quickFilterReducer(state, action2);

      expect(newState).toEqual({
        ...initialState,
        customFilters: [second],
      });
    });
    it('should update quickfilter', () => {
      const action1 = QuickfilterActions.setCustomQuickfilter({
        filters: [second],
      });
      state = quickFilterReducer(state, action1);

      const action = QuickfilterActions.updateCustomQuickfilter({
        newFilter: quickfilter,
        oldFilter: second,
      });
      const newState = quickFilterReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        customFilters: [quickfilter],
      });
    });
  });
});
