import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import { FilterDimension } from '../../reducers/filter/filter.reducer';
import {
  filterSelected,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
  timePeriodSelected,
  triggerLoad,
} from '../';

describe('Filter Actions', () => {
  const errorMessage = 'An error occured';

  describe('Get initial filters actions', () => {
    test('loadFilterDimenstionData', () => {
      const searchFor = 'search';
      const action = loadFilterDimensionData({
        filterDimension: FilterDimension.ORG_UNITS,
        searchFor,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNITS,
        searchFor,
        type: '[Filter] Load Filter Dimension Data',
      });
    });

    test('loadFilterDimensionDataSuccess', () => {
      const items = [new IdValue('Department1', 'Department1')];
      const action = loadFilterDimensionDataSuccess({
        filterDimension: FilterDimension.ORG_UNITS,
        items,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNITS,
        items,
        type: '[Filter] Load Filter Dimension Data Success',
      });
    });

    test('loadFilterDimensionDataFailure', () => {
      const action = loadFilterDimensionDataFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Filter] Load Filter Dimension Data Failure',
      });
    });

    test('filterSelected', () => {
      const filter = new SelectedFilter('test', undefined);
      const action = filterSelected({ filter });

      expect(action).toEqual({
        filter,
        type: '[Filter] Filter selected',
      });
    });

    test('timePeriodSelected', () => {
      const timePeriod = TimePeriod.YEAR;
      const action = timePeriodSelected({ timePeriod });

      expect(action).toEqual({
        timePeriod,
        type: '[Filter] Time period selected',
      });
    });
  });

  test('triggerLoad', () => {
    const action = triggerLoad();

    expect(action).toEqual({
      type: '[Filter] Trigger Load',
    });
  });
});
