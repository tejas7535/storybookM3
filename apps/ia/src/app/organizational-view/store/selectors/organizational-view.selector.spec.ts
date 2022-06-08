import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import { AttritionOverTime, Color, Employee } from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { CountryData } from '../../world-map/models/country-data.model';
import { initialState, OrganizationalViewState } from '..';
import {
  getAttritionOverTimeOrgChartData,
  getIsLoadingAttritionOverTimeOrgChart,
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getSelectedChartType,
  getWorldMap,
} from './organizational-view.selector';

describe('Organizational View Selector', () => {
  const fakeState: {
    organizationalView: OrganizationalViewState;
    filter: FilterState;
  } = {
    organizationalView: {
      ...initialState,
      orgChart: {
        data: [
          { employeeId: '123' } as unknown as Employee,
          { employeeId: '456' } as unknown as Employee,
        ],
        loading: true,
        errorMessage: undefined,
      },
      worldMap: {
        data: [
          { name: 'Germany' } as unknown as CountryData,
          { name: 'Poland' } as unknown as CountryData,
        ],
        loading: true,
        errorMessage: undefined,
      },
      attritionOverTime: {
        ...initialState.attritionOverTime,
        loading: true,
      },
    },
    filter: {
      selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
    } as unknown as FilterState,
  };

  describe('getOrgChart', () => {
    test('should return employees for org chart', () => {
      expect(getOrgChart(fakeState)).toEqual(
        fakeState.organizationalView.orgChart.data
      );
    });
  });

  describe('getWorldMap', () => {
    test('should return country data for world map', () => {
      expect(getWorldMap(fakeState)).toEqual(
        fakeState.organizationalView.worldMap.data
      );
    });
  });

  describe('getIsLoadingOrgChart', () => {
    test('should return loading status', () => {
      expect(getIsLoadingOrgChart(fakeState)).toBeTruthy();
    });
  });

  describe('getIsLoadingWorldMap', () => {
    test('should return loading status', () => {
      expect(getIsLoadingWorldMap(fakeState)).toBeTruthy();
    });
  });

  describe('getSelectedChartType', () => {
    test('should return currently selected chart type', () => {
      expect(getSelectedChartType(fakeState)).toEqual(ChartType.ORG_CHART);
    });
  });

  describe('getAttritionOverTimeOrgChartData', () => {
    test('should return data', () => {
      const data = { data: {} } as unknown as AttritionOverTime;

      const result = getAttritionOverTimeOrgChartData.projector(data);
      delete result.visualMap.formatter;

      expect(result).toEqual({
        series: [],
        visualMap: {
          show: true,
          dimension: 0,
          pieces: [
            {
              gte: 0,
              lte: 3,
              color: Color.GREEN,
            },
            {
              gt: 3,
              lte: 5,
              color: Color.BLUE,
            },
          ],
          orient: 'horizontal',
        },
        legend: {
          show: false,
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisPointer: {
            label: {
              precision: 0,
            },
            snap: true,
          },
        },
      });
    });
  });

  describe('getIsLoadingAttritionOverTimeOrgChart', () => {
    test('should return loading State', () => {
      expect(
        getIsLoadingAttritionOverTimeOrgChart.projector(
          fakeState.organizationalView
        )
      ).toBeTruthy();
    });
  });
});
