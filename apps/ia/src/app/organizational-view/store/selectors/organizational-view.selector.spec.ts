import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import { AttritionOverTime, HeatType } from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { DimensionFluctuationData } from '../../models/dimension-fluctuation-data.model';
import { CountryData } from '../../world-map/models/country-data.model';
import { initialState, OrganizationalViewState } from '..';
import {
  getAttritionOverTimeOrgChartData,
  getIsLoadingAttritionOverTimeOrgChart,
  getIsLoadingOrgChart,
  getIsLoadingOrgUnitFluctuationRate,
  getIsLoadingWorldMap,
  getOrgChart,
  getOrgChartEmployees,
  getOrgChartEmployeesLoading,
  getOrgUnitFluctuationDialogEmployeeData,
  getOrgUnitFluctuationDialogMeta,
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
              username: 'SchmeichelPeter',
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
          } as unknown as CountryData,
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
          } as unknown as CountryData,
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
    test('should return org chart', () => {
      expect(getOrgChart(fakeState)).toEqual(
        fakeState.organizationalView.orgChart.data
      );
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
          data: {} as AttritionOverTime,
          loading: false,
          errorMessage: '',
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

  describe('getAttritionOverTimeOrgChartData', () => {
    test('should return data', () => {
      const data = { data: {} } as unknown as AttritionOverTime;

      const result = getAttritionOverTimeOrgChartData.projector(data);

      expect(result).toEqual({
        series: [],
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

    test('should return undefined if data not available', () => {
      const data = {};
      const result = getAttritionOverTimeOrgChartData.projector(data);

      expect(result).toBeUndefined();
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
