import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import {
  AttritionOverTime,
  EmployeesRequest,
  FilterDimension,
  TimePeriod,
} from '../shared/models';
import {
  DimensionParentResponse,
  OrgChartEmployeesResponse,
  OrgChartResponse,
  OrgUnitFluctuationRate,
} from './org-chart/models';
import { OrganizationalViewService } from './organizational-view.service';
import { WorldMapResponse } from './world-map/models';

describe('OrganizationalViewService', () => {
  let httpMock: HttpTestingController;
  let service: OrganizationalViewService;
  let spectator: SpectatorService<OrganizationalViewService>;

  const createService = createServiceFactory({
    service: OrganizationalViewService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrgChart', () => {
    test('should get org units for org chart', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123-321';
      const mock: OrgChartResponse = { dimensions: [] };
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      service.getOrgChart(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/org-chart?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getOrgChartEmployeesForNode', () => {
    test('should get employees for node in org chart', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123-321';
      const mock: OrgChartEmployeesResponse = { employees: [] };
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      service.getOrgChartEmployeesForNode(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/org-chart-employees?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getWorldMap', () => {
    test('should get country data for world map', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123-321';
      const mock: WorldMapResponse = { data: [] };
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      service.getWorldMap(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/world-map?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getParentOrgUnit', () => {
    test('should get parent for provided org unit id', () => {
      const mock: DimensionParentResponse =
        {} as unknown as DimensionParentResponse;
      const parentEmployeeId = '123';
      const dimension = FilterDimension.ORG_UNIT;

      service
        .getParentOrgUnit(dimension, parentEmployeeId)
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(
        `api/v1/dimension-parent?dimension=${dimension}&value=123`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getOrgUnitFluctuationRate', () => {
    test('should get org unit fluctuation rate', () => {
      const orgUnit = '123';
      const timeRange = '123-321';
      const response = {
        fluctuationRate: 0.1,
        unforcedFluctuationRate: 0.01,
      };
      const mock: OrgUnitFluctuationRate = {
        ...response,
        value: orgUnit,
        timeRange,
      };
      const request = {
        filterDimension: FilterDimension.ORG_UNIT,
        value: orgUnit,
        timeRange,
      } as EmployeesRequest;

      service.getOrgUnitFluctuationRate(request).subscribe((resp) => {
        expect(resp).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/fluctuation-rate?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });

  describe('getAttritionOverTime', () => {
    test('should get attrition data for last years', () => {
      const orgUnit = 'Schaeffler12';
      const mock: AttritionOverTime = {
        data: {
          '2019': {
            attrition: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5],
          },
        },
      };

      service
        .getAttritionOverTime(
          FilterDimension.ORG_UNIT,
          orgUnit,
          TimePeriod.LAST_THREE_YEARS
        )
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(
        `api/v1/attrition-over-time?dimension=${FilterDimension.ORG_UNIT}&value=${orgUnit}&time_period=${TimePeriod.LAST_THREE_YEARS}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
