import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import {
  AttritionOverTime,
  Employee,
  EmployeesRequest,
  TimePeriod,
} from '../shared/models';
import { OrgChartResponse } from './org-chart/models';
import { OrganizationalViewService } from './organizational-view.service';
import { CountryData, WorldMapResponse } from './world-map/models';

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
    test('should get employees for org chart', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123-321';
      const mock: OrgChartResponse = { employees: [] };
      const request = { orgUnit, timeRange } as unknown as EmployeesRequest;

      service.getOrgChart(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne(
        `api/v1/org-chart?org_unit=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('addContinentToCountryData', () => {
    test('should look for correct continent and set it', () => {
      const data = [
        {
          name: 'Germany',
        } as CountryData,
      ];

      const result = service.addContinentToCountryData(data);

      expect(result.length).toEqual(1);
      expect(result[0].continent).toEqual('Europe');
    });

    test('should look for correct continent and set it with name_long prop', () => {
      const data = [
        {
          name: 'Czech Republic',
        } as CountryData,
      ];

      // world.json contains Czech Rep. as name and Czech Republic as name_long
      const result = service.addContinentToCountryData(data);

      expect(result.length).toEqual(1);
      expect(result[0].continent).toEqual('Europe');
      expect(result[0].name).toEqual('Czech Rep.');
    });
  });

  describe('getWorldMap', () => {
    test('should get country data for world map', () => {
      const orgUnit = 'Schaeffler12';
      const timeRange = '123-321';
      const mock: WorldMapResponse = { data: [] };
      const request = { orgUnit, timeRange } as unknown as EmployeesRequest;
      service.addContinentToCountryData = jest.fn(() => mock.data);

      service.getWorldMap(request).subscribe((response) => {
        expect(response).toEqual(mock);
        expect(service.addContinentToCountryData).toHaveBeenCalledWith(
          mock.data
        );
      });

      const req = httpMock.expectOne(
        `api/v1/world-map?org_unit=${orgUnit}&time_range=${timeRange}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getParentEmployee', () => {
    test('should get parent for provided employee id', () => {
      const mock: Employee = {} as unknown as Employee;
      const parentEmployeeId = '123';
      const childReportDate = '345';

      service
        .getParentEmployee(parentEmployeeId, childReportDate)
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(
        'api/v1/employee?employee_key=123&report_date=345'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getAttritionOverTime', () => {
    test('should get attrition data for last years', () => {
      const orgUnit = 'Schaeffler12';
      const mock: AttritionOverTime = {
        events: [],
        data: {
          '2019': {
            attrition: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5],
            employees: [],
          },
        },
      };

      service
        .getAttritionOverTime(orgUnit, TimePeriod.LAST_THREE_YEARS)
        .subscribe((response) => {
          expect(response).toEqual(mock);
        });

      const req = httpMock.expectOne(
        `api/v1/attrition-over-time?org_unit=${orgUnit}&time_period=${TimePeriod.LAST_THREE_YEARS}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
});
