import { QuickFilter } from '@mac/msd/models';

import {
  addCustomQuickfilter,
  removeCustomQuickfilter,
  setCustomQuickfilter,
  updateCustomQuickfilter,
} from './quickfilter.actions';

describe('Quickfilter Actions', () => {
  const quickFilter: QuickFilter = {
    columns: ['1'],
    custom: true,
    filter: {},
    title: 'name',
  };
  it('addCustomQuickfilter should include a filter', () => {
    expect(addCustomQuickfilter({ filter: quickFilter }).filter).toBe(
      quickFilter
    );
  });
  it('setCustomQuickfilter should include a filter', () => {
    expect(setCustomQuickfilter({ filters: [quickFilter] }).filters[0]).toBe(
      quickFilter
    );
  });
  it('removeCustomQuickfilter should include a filter', () => {
    expect(removeCustomQuickfilter({ filter: quickFilter }).filter).toBe(
      quickFilter
    );
  });
  it('updateCustomQuickfilter should include a filter', () => {
    const obj = {} as QuickFilter;
    const action = updateCustomQuickfilter({
      oldFilter: obj,
      newFilter: quickFilter,
    });
    expect(action.newFilter).toBe(quickFilter);
    expect(action.oldFilter).toBe(obj);
  });
});
