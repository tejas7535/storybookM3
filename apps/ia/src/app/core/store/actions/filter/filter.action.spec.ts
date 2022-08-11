import {
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
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
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
        type: '[Filter] Load Filter Dimension Data',
      });
    });

    test('loadFilterDimensionDataSuccess', () => {
      const items = [new IdValue('Department1', 'Department1')];
      const action = loadFilterDimensionDataSuccess({
        filterDimension: FilterDimension.ORG_UNIT,
        items,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
        items,
        type: '[Filter] Load Filter Dimension Data Success',
      });
    });

    test('loadFilterDimensionDataFailure', () => {
      const action = loadFilterDimensionDataFailure({
        filterDimension: FilterDimension.ORG_UNIT,
        errorMessage,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
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
