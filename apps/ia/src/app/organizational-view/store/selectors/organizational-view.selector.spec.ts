import { LineSeriesOption } from 'echarts';

import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import {
  LINE_SERIES_BASE_OPTIONS,
  SMOOTH_LINE_SERIES_OPTIONS,
} from '../../../shared/charts/line-chart/line-chart.config';
import {
  AttritionSeries,
  EmployeeAttritionMeta,
  FilterDimension,
  IdValue,
} from '../../../shared/models';
import { AttritionDialogFluctuationMeta } from '../../attrition-dialog/models/attrition-dialog-fluctuation-meta.model';
import { ChartType, DimensionFluctuationData, SeriesType } from '../../models';
import { CountryDataAttrition } from '../../world-map/models/country-data-attrition.model';
import { initialState, OrganizationalViewState } from '..';
import {
  getChildAttritionOverTimeOrgChartSeries,
  getChildDimensionName,
  getChildIsLoadingAttritionOverTimeOrgChart,
  getDimensionKeyForWorldMap,
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getOrgChartEmployees,
  getOrgChartEmployeesLoading,
  getParentAttritionOverTimeOrgChartData,
  getParentIsLoadingAttritionOverTimeOrgChart,
  getRegions,
  getSelectedChartType,
  getWorldMap,
  getWorldMapFluctuationDialogMeta,
  getWorldMapFluctuationDialogMetaData,
  mapDataToLineSerie,
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
          { id: '123' } as DimensionFluctuationData,
          { id: '456' } as DimensionFluctuationData,
        ],
        loading: true,
        errorMessage: undefined,
        employees: {
          data: [
            {
              employeeName: ' Peter',
              userId: 'SchmeichelPeter',
              employeeKey: '20001111',
              orgUnit: 'Space',
              positionDescription: 'Spaceman',
            },
          ],
          loading: false,
          errorMessage: undefined,
        },
      },
      worldMap: {
        selectedRegion: undefined,
        selectedCountry: 'Germany',
        data: [
          {
            name: 'Germany',
            region: 'Europe',
            attritionMeta: {
              employeesLost: 3,
              remainingFluctuation: 1,
              forcedFluctuation: 0,
              unforcedFluctuation: 14,
              resignationsReceived: 99,
              employeesAdded: 0,
              openPositions: 400,
            },
          } as unknown as CountryDataAttrition,
          {
            name: 'Poland',
            region: 'Europe',
            attritionMeta: {
              employeesLost: 33,
              remainingFluctuation: 0,
              forcedFluctuation: 5,
              unforcedFluctuation: 4,
              resignationsReceived: 9,
              employeesAdded: 2,
              openPositions: 0,
            },
          } as unknown as CountryDataAttrition,
        ],
        loading: true,
        errorMessage: undefined,
      },
      attritionOverTime: {
        ...initialState.attritionOverTime,
        parent: {
          ...initialState.attritionOverTime.parent,
          loading: true,
        },
        child: {
          ...initialState.attritionOverTime.child,
          dimensionName: 'child',
          loading: true,
        },
      },
    },
    filter: {
      selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
    } as unknown as FilterState,
  };

  describe('getOrgChart', () => {
    test('should return org chart data with dimension information', () => {
      const idValue = new IdValue('test', 'val');
      const data: DimensionFluctuationData[] = [{} as DimensionFluctuationData];
      expect(
        getOrgChart.projector(false, data, FilterDimension.BOARD, idValue)
      ).toEqual({
        data,
        dimension: FilterDimension.BOARD,
      });
    });

    test('should return empty org chart if no dimension value is set', () => {
      const data: DimensionFluctuationData[] = [];
      expect(
        getOrgChart.projector(
          false,
          data,
          FilterDimension.BOARD,
          undefined as undefined
        )
      ).toEqual({
        data: [],
        dimension: FilterDimension.BOARD,
      });
    });

    test('should return empty org chart if loading is true', () => {
      const data: DimensionFluctuationData[] = [{} as DimensionFluctuationData];
      expect(
        getOrgChart.projector(
          true,
          data,
          FilterDimension.BOARD,
          undefined as undefined
        )
      ).toEqual({
        data: [],
        dimension: FilterDimension.BOARD,
      });
    });
  });

  describe('getOrgChartEmployees', () => {
    test('should return employees for org chart', () => {
      expect(
        getOrgChartEmployees.projector(fakeState.organizationalView)
      ).toEqual(fakeState.organizationalView.orgChart.employees.data);
    });
  });

  describe('getOrgChartEmployeesLoading', () => {
    test('should return loading status', () => {
      expect(
        getOrgChartEmployeesLoading.projector(fakeState.organizationalView)
      ).toEqual(fakeState.organizationalView.orgChart.employees.loading);
    });
  });

  describe('getRegions', () => {
    test('should return regions', () => {
      const result = getRegions.projector([
        { region: 'Europe' },
        { region: 'Asia' },
      ] as CountryDataAttrition[]);

      expect(result).toEqual(['Europe', 'Asia']);
    });
  });

  describe('getDimensionKeyForWorldMap', () => {
    const countryData: CountryDataAttrition[] = [
      {
        name: 'Poland',
        countryKey: 'PL',
        region: 'Europe',
        regionKey: '2',
        attritionMeta: {} as EmployeeAttritionMeta,
      },
      {
        name: 'Germany',
        countryKey: 'DE',
        region: 'Europe',
        regionKey: '2',
        attritionMeta: {} as EmployeeAttritionMeta,
      },
      {
        name: 'Japan',
        countryKey: 'PL',
        region: 'Asia Pacific',
        regionKey: '5',
        attritionMeta: {} as EmployeeAttritionMeta,
      },
    ];

    test('should return country key for country dimension', () => {
      const filterDimension = FilterDimension.COUNTRY;
      const dimensionName = 'Germany';
      const result = getDimensionKeyForWorldMap(
        filterDimension,
        dimensionName
      ).projector(countryData);

      expect(result).toEqual('DE');
    });

    test('should return region key for region dimension', () => {
      const filterDimension = FilterDimension.REGION;
      const dimensionName = 'Asia Pacific';
      const result = getDimensionKeyForWorldMap(
        filterDimension,
        dimensionName
      ).projector(countryData);

      expect(result).toEqual('5');
    });

    test('should return undefined when country not found', () => {
      const filterDimension = FilterDimension.COUNTRY;
      const dimensionName = 'China';
      const result = getDimensionKeyForWorldMap(
        filterDimension,
        dimensionName
      ).projector(countryData);

      expect(result).toBeUndefined();
    });

    test('should return undefined when region not found', () => {
      const filterDimension = FilterDimension.REGION;
      const dimensionName = 'Greater China';
      const result = getDimensionKeyForWorldMap(
        filterDimension,
        dimensionName
      ).projector(countryData);

      expect(result).toBeUndefined();
    });

    test('should return undefined when dimension different than region or country', () => {
      const filterDimension = FilterDimension.ORG_UNIT;
      const dimensionName = 'Greater China';
      const result = getDimensionKeyForWorldMap(
        filterDimension,
        dimensionName
      ).projector(countryData);

      expect(result).toBeUndefined();
    });
  });

  describe('getChildDimensionName', () => {
    test('should return child dimension name', () => {
      const dimensionName = 'SLK';
      const input = {
        attritionOverTime: {
          child: {
            dimensionName,
          },
        },
      };
      const result = getChildDimensionName.projector(
        input as OrganizationalViewState
      );

      expect(result).toEqual(dimensionName);
    });
  });

  describe('getWorldMapFluctuationDialogMetaData', () => {
    test('should return region meta if region set', () => {
      const input = {
        ...fakeState.organizationalView,
        worldMap: {
          ...fakeState.organizationalView.worldMap,
          selectedRegion: 'Europe',
          selectedCountry: undefined as string,
        },
      };

      const result = getWorldMapFluctuationDialogMetaData.projector(input);

      expect(result).toEqual({
        employeesAdded: 2,
        employeesLost: 36,
        forcedFluctuation: 5,
        remainingFluctuation: 1,
        openPositions: 400,
        resignationsReceived: 108,
        title: 'Europe',
        unforcedFluctuation: 18,
        openPositionsAvailable: true,
      });
    });

    test('should return country meta if country set', () => {
      const input = {
        ...fakeState.organizationalView,
        worldMap: {
          ...fakeState.organizationalView.worldMap,
          selectedContinent: undefined as string,
          selectedCountry: 'Germany',
        },
      };

      const result = getWorldMapFluctuationDialogMetaData.projector(input);

      expect(result).toEqual({
        employeesAdded: 0,
        employeesLost: 3,
        forcedFluctuation: 0,
        remainingFluctuation: 1,
        openPositions: 400,
        resignationsReceived: 99,
        unforcedFluctuation: 14,
        openPositionsAvailable: true,
      });
    });
  });

  describe('getWorldMapFluctuationDialogMeta', () => {
    test('should return fluctuation meta', () => {
      const timeRange = {
        id: '1577863715000|1609399715000',
        value: '01.01.2020 - 31.12.2020',
      };
      const data = {};

      const result = getWorldMapFluctuationDialogMeta.projector(
        timeRange,
        data as AttritionDialogFluctuationMeta
      );

      expect(result).toEqual({
        selectedTimeRange: '01.01.2020 - 31.12.2020',
        data,
        showAttritionRates: false,
      });
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

  describe('getParentAttritionOverTimeOrgChartData', () => {
    test('should return parent attrition over time org chart data', () => {
      const result = getParentAttritionOverTimeOrgChartData.projector(
        fakeState.organizationalView
      );

      expect(result.length).toEqual(1);
    });
  });

  describe('getChildAttritionOverTimeOrgChartSeries', () => {
    test('should return parent attrition over time org chart data', () => {
      const result = getChildAttritionOverTimeOrgChartSeries.projector(
        fakeState.organizationalView
      );

      expect(result.length).toEqual(1);
    });
  });

  describe('getParentIsLoadingAttritionOverTimeOrgChart', () => {
    test('should return loading State', () => {
      expect(
        getParentIsLoadingAttritionOverTimeOrgChart.projector(
          fakeState.organizationalView
        )
      ).toBeTruthy();
    });
  });

  describe('getChildIsLoadingAttritionOverTimeOrgChart', () => {
    test('should return loading State', () => {
      expect(
        getChildIsLoadingAttritionOverTimeOrgChart.projector(
          fakeState.organizationalView
        )
      ).toBeTruthy();
    });
  });

  describe('mapDataToLineSerie', () => {
    const id = '123';
    const seriesName = 'Test Series';
    const data: AttritionSeries = {
      [SeriesType.UNFORCED_LEAVERS]: {
        attrition: [1, 2, 3, 4, 5],
      },
      [SeriesType.UNFORCED_FLUCTUATION]: {
        attrition: [10, 20, 30, 40, 50],
      },
    };

    test('should return line series option with selected data is unforced leavers', () => {
      const selectedSeriesType = SeriesType.UNFORCED_LEAVERS;

      const expected: LineSeriesOption[] = [
        {
          ...LINE_SERIES_BASE_OPTIONS,
          id,
          name: seriesName,
          data: data[SeriesType.UNFORCED_LEAVERS].attrition,
          tooltip: {
            formatter: expect.any(Function),
          },
        },
      ] as unknown as LineSeriesOption[];

      const result = mapDataToLineSerie(
        id,
        data,
        seriesName,
        selectedSeriesType
      );

      expect(result).toEqual(expected);
    });

    test('should return line series option with selected data when data is unforced fluctuation', () => {
      const selectedSeriesType = SeriesType.UNFORCED_FLUCTUATION;

      const expected: LineSeriesOption[] = [
        {
          ...SMOOTH_LINE_SERIES_OPTIONS,
          id,
          name: seriesName,
          data: data[SeriesType.UNFORCED_FLUCTUATION].attrition,
          tooltip: {
            formatter: expect.any(Function),
          },
        },
      ] as unknown as LineSeriesOption[];

      const result = mapDataToLineSerie(
        id,
        data,
        seriesName,
        selectedSeriesType
      );

      expect(result).toEqual(expected);
    });
  });
});
