import {
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  autocompleteBenchmarkDimensionData,
  autocompleteDimensionData,
  benchmarDimensionSelected,
  benchmarkFilterSelected,
  dimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
  timePeriodSelected,
  timeRangeSelected,
  triggerLoad,
} from '../';

describe('Filter Actions', () => {
  const errorMessage = 'An error occured';

  describe('Get initial filters actions', () => {
    test('loadFilterBenchmarkDimensionData', () => {
      const searchFor = 'search';
      const action = loadFilterBenchmarkDimensionData({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
        type: '[Filter] Load Filter Benchmark Dimension Data',
      });
    });

    test('autocompleteBenchmarkDimensionData', () => {
      const searchFor = 'search';
      const action = autocompleteBenchmarkDimensionData({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
        type: '[Filter] Trigger Benchmark Dimension Autocomplete',
      });
    });

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

    test('autocompleteDimensionData', () => {
      const searchFor = 'search';
      const action = autocompleteDimensionData({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      });

      expect(action).toEqual({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
        type: '[Filter] Trigger Dimension Autocomplete',
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

    test('benchmarkFilterSelected', () => {
      const filter = new SelectedFilter('test', undefined);
      const action = benchmarkFilterSelected({ filter });

      expect(action).toEqual({
        filter,
        type: '[Filter] Benchmark Filter selected',
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

    test('dimensionSelected', () => {
      const action = dimensionSelected();

      expect(action).toEqual({
        type: '[Filter] Dimension Selected',
      });
    });

    test('benchmarDimensionSelected', () => {
      const action = benchmarDimensionSelected();

      expect(action).toEqual({
        type: '[Filter] Benchmark Dimension Selected',
      });
    });

    test('timeRangeSelected', () => {
      const timeRange = new SelectedFilter('x', new IdValue('a', 'b'));
      const action = timeRangeSelected({ timeRange });

      expect(action).toEqual({
        timeRange,
        type: '[Filter] Time range selected',
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
