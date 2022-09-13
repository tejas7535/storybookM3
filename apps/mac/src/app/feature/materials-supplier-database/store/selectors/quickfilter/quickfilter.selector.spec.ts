import { initialState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import * as QuickFilterSelectors from './quickfilter.selectors';

describe('QuickfilterSelectors', () => {
  it('should get state', () => {
    expect(
      QuickFilterSelectors.getQuickFilterState.projector({
        quickfilter: initialState,
      })
    ).toEqual(initialState);
  });

  it('should get data filter', () => {
    expect(QuickFilterSelectors.getQuickFilter.projector(initialState)).toEqual(
      initialState.customFilters
    );
  });

  it('should get data filters', () => {
    expect(QuickFilterSelectors.getQuickFilter.projector(initialState)).toEqual(
      []
    );
  });
});
