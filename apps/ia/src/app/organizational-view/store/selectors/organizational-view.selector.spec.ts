import { initialState, OrganizationalViewState } from '..';
import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import { ChartType } from '../../models/chart-type.enum';
import { OrgChartEmployee } from '../../org-chart/models/org-chart-employee.model';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  getIsLoadingOrgChart,
  getIsLoadingWorldMap,
  getOrgChart,
  getSelectedChartType,
  getWorldMap,
  getWorldMapContinents,
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
          ({ employeeId: '123' } as unknown) as OrgChartEmployee,
          ({ employeeId: '456' } as unknown) as OrgChartEmployee,
        ],
        loading: true,
        errorMessage: undefined,
      },
      worldMap: {
        data: [
          ({ name: 'Germany' } as unknown) as CountryData,
          ({ name: 'Poland' } as unknown) as CountryData,
        ],
        continents: [
          {
            id: 'europe',
            value: 'Europe',
          },
          {
            id: 'asia',
            value: 'Asia',
          },
        ],
        loading: true,
        errorMessage: undefined,
      },
    },
    filter: ({
      selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
    } as unknown) as FilterState,
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

  describe('getWorldMapContinents', () => {
    test('should return continents', () => {
      expect(getWorldMapContinents(fakeState)).toEqual(
        fakeState.organizationalView.worldMap.continents
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
});
