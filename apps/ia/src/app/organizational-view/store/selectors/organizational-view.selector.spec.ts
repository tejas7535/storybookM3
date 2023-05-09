import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import {
  AttritionOverTime,
  EmployeeAttritionMeta,
  FilterDimension,
  HeatType,
  IdValue,
} from '../../../shared/models';
import { ChartType, DimensionFluctuationData } from '../../models';
import { CountryDataAttrition } from '../../world-map/models/country-data-attrition.model';
import { initialState, OrganizationalViewState } from '..';
import {
  getChildAttritionOverTimeOrgChartSeries,
  getChildDimensionName,
  getChildIsLoadingAttritionOverTimeOrgChart,
  getDimensionKeyForWorldMap,
  getIsLoadingOrgChart,
  getIsLoadingOrgUnitFluctuationRate,
  getIsLoadingWorldMap,
  getOrgChart,
  getOrgChartEmployees,
  getOrgChartEmployeesLoading,
  getOrgUnitFluctuationDialogEmployeeData,
  getOrgUnitFluctuationDialogMeta,
  getParentAttritionOverTimeOrgChartData,
  getParentIsLoadingAttritionOverTimeOrgChart,
  getRegions,
  getSelectedChartType,
  getWorldMap,
  getWorldMapFluctuationDialogMeta,
  getWorldMapFluctuationDialogMetaData,
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
        fluctuationRates: {
          selectedEmployeeId: '432433',
          data: [],
          loading: false,
          errorMessage: undefined,
        },
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
      expect(
        getOrgChart.projector(
          fakeState.organizationalView,
          FilterDimension.BOARD,
          idValue
        )
      ).toEqual({
        data: fakeState.organizationalView.orgChart.data,
        dimension: FilterDimension.BOARD,
      });
    });

    test('should return empty org chart if no dimension value is set', () => {
      expect(
        getOrgChart.projector(
          fakeState.organizationalView,
          FilterDimension.BOARD,
          // eslint-disable-next-line unicorn/no-useless-undefined
          undefined
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

  describe('getOrgUnitFluctuationDialogEmployeeData', () => {
    test('should return attrition dialog fluctuation meta', () => {
      const timeRange = {
        id: '1577863715000|1609399715000',
        value: '01.01.2020 - 31.12.2020',
      };
      const state = {
        orgChart: {
          fluctuationRates: {
            selectedEmployeeId: '123',
            data: [
              {
                value: '432432',
                timeRange: '1577863715000|1609399715000',
                fluctuationRate: 0.1,
                unforcedFluctuationRate: 0.01,
              },
            ],
            loading: false,
            errorMessage: '',
          },
          data: [
            {
              id: '123',
              parentId: '321',
              dimensionKey: '432432',
              attritionMeta: {
                employeesLost: 4,
              },
            } as DimensionFluctuationData,
          ],
        },
        attritionOverTime: {
          parent: {
            data: {} as AttritionOverTime,
            loading: false,
            errorMessage: '',
          },
          child: {
            data: {} as AttritionOverTime,
            loading: false,
            errorMessage: '',
          },
        },
      };

      const result = getOrgUnitFluctuationDialogEmployeeData.projector(
        state,
        timeRange
      );

      expect(result).toEqual({
        fluctuationRate: 0.1,
        unforcedFluctuationRate: 0.01,
        heatType: HeatType.NONE,
        employeesLost: 4,
      });
    });
  });

  describe('getOrgUnitFluctuationDialogMeta', () => {
    test('should return meta data', () => {
      const timeRange = {
        id: '1577863715000|1609399715000',
        value: '01.01.2020 - 31.12.2020',
      };
      const data = {};
      const result = getOrgUnitFluctuationDialogMeta.projector(timeRange, data);

      expect(result).toEqual({
        selectedTimeRange: '01.01.2020 - 31.12.2020',
        data,
        showAttritionRates: true,
      });
    });
  });

  describe('getIsLoadingOrgUnitFluctuationRate', () => {
    test('should return loading', () => {
      const result = getIsLoadingOrgUnitFluctuationRate.projector(
        fakeState.organizationalView
      );

      expect(result).toBeFalsy();
    });
  });

  describe('getRegions', () => {
    test('should return regions', () => {
      const result = getRegions.projector([
        { region: 'Europe' },
        { region: 'Asia' },
      ]);

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
      const result = getChildDimensionName.projector(input);

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
        data
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
    test('should return data', () => {
      const state = {
        attritionOverTime: {
          parent: {
            dimensionName: 'SLK',
            data: {
              data: {
                ['SLK']: {
                  attrition: 0.2,
                },
              },
            },
            loading: false,
            errorMessage: '',
          },
        },
      };

      const result = getParentAttritionOverTimeOrgChartData.projector(state);

      expect(result).toEqual({
        series: [
          {
            data: 0.2,
            lineStyle: { width: 4 },
            name: 'SLK',
            showSymbol: false,
            type: 'line',
          },
        ],
        yAxis: {
          axisPointer: { label: { precision: 0 }, snap: true },
          minInterval: 1,
          type: 'value',
        },
      });
    });

    test('should return undefined if data not available', () => {
      const data = {};
      const result = getParentAttritionOverTimeOrgChartData.projector(data);

      expect(result).toBeUndefined();
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

  describe('getChildAttritionOverTimeOrgChartSeries', () => {
    test('should return series', () => {
      const state = {
        attritionOverTime: {
          child: {
            dimensionName: 'SLK',
            data: {
              data: {
                ['SLK']: {
                  attrition: 0.2,
                },
              },
            },
            loading: false,
            errorMessage: '',
          },
        },
      };

      const result = getChildAttritionOverTimeOrgChartSeries.projector(state);

      expect(result).toEqual([
        {
          data: 0.2,
          lineStyle: { width: 4 },
          name: 'SLK',
          showSymbol: false,
          type: 'line',
        },
      ]);
    });

    test('should return undefined if data not available', () => {
      const data = {};
      const result = getChildAttritionOverTimeOrgChartSeries.projector(data);

      expect(result).toBeUndefined();
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
});
