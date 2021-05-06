import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { OrgChartEmployee } from '../../organizational-view/org-chart/models/org-chart-employee.model';
import {
  AttritionOverTime,
  EmployeesRequest,
  InitialFiltersResponse,
  OrgChartResponse,
  ParentEmployeeResponse,
  WorldMapResponse,
} from '../models';
import { EmployeeService } from './employee.service';

describe('EmployeesService', () => {
  let httpMock: HttpTestingController;
  let service: EmployeeService;
  let spectator: SpectatorService<EmployeeService>;

  const createService = createServiceFactory({
    service: EmployeeService,
    imports: [HttpClientTestingModule],
    providers: [
      EmployeeService,
      DataService,
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('fixIncomingEmployeeProps', () => {
    test('should fix props', () => {
      const elem = ({
        employeeId: '13',
        parentEmployeeId: '123',
        exitDate: '2015-10-10',
        totalSubordinates: 0,
        directSubordinates: 0,
        directAttrition: 0,
        totalAttrition: 0,
        entryDate: '2010-10-10',
        terminationDate: '2015-08-10',
      } as unknown) as OrgChartEmployee;

      const result = EmployeeService.fixIncomingEmployeeProps(elem);

      expect(result).toEqual(({
        employeeId: '13',
        parentEmployeeId: '123',
        exitDate: new Date('2015-10-10').toJSON(),
        totalSubordinates: 0,
        directSubordinates: 0,
        directAttrition: 0,
        totalAttrition: 0,
        entryDate: new Date('2010-10-10').toJSON(),
        terminationDate: new Date('2015-08-10').toJSON(),
      } as unknown) as OrgChartEmployee);
    });

    test('should ignore undefined values', () => {
      const elem = ({
        employeeId: '13',
        parentEmployeeId: '123',
        exitDate: undefined,
        totalSubordinates: 0,
        directSubordinates: 0,
        directAttrition: 0,
        totalAttrition: 0,
        entryDate: undefined,
        terminationDate: undefined,
      } as unknown) as OrgChartEmployee;

      const result = EmployeeService.fixIncomingEmployeeProps(elem);

      expect(result).toEqual(({
        employeeId: '13',
        parentEmployeeId: '123',
        exitDate: undefined,
        totalSubordinates: 0,
        directSubordinates: 0,
        directAttrition: 0,
        totalAttrition: 0,
        entryDate: undefined,
        terminationDate: undefined,
      } as unknown) as OrgChartEmployee);
    });
  });

  describe('employeeLeftInTimeRange', () => {
    test('should return true when date is in range', () => {
      const date = new Date();
      const range = `0|${date.getTime() + 1}`;

      const employee = ({
        exitDate: date.toJSON(),
      } as unknown) as OrgChartEmployee;

      const result = EmployeeService.employeeLeftInTimeRange(employee, range);

      expect(result).toBeTruthy();
    });

    test('should return false when date is not in range', () => {
      const date = new Date();
      const range = `0|${date.getTime() + 1}`;

      const employee = ({ exitDate: undefined } as unknown) as OrgChartEmployee;

      const result = EmployeeService.employeeLeftInTimeRange(employee, range);

      expect(result).toBeFalsy();
    });
  });

  describe('getInitialFilters', () => {
    test('should get initial filters', () => {
      const mock: InitialFiltersResponse = ({} as unknown) as InitialFiltersResponse;

      service.getInitialFilters().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/initial-filters');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getOrgChart', () => {
    test('should get employees for org chart', () => {
      const mock: OrgChartResponse = { employees: [] };
      const request = ({} as unknown) as EmployeesRequest;
      EmployeeService.fixIncomingEmployeeProps = jest.fn();

      service.getOrgChart(request).subscribe((response) => {
        expect(response).toEqual(mock);
        expect(EmployeeService.fixIncomingEmployeeProps).toHaveBeenCalledTimes(
          mock.employees.length
        );
      });

      const req = httpMock.expectOne('/org-chart');
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });

  describe('getParentEmployee', () => {
    test('should get parent for provided employee id', () => {
      const mock: ParentEmployeeResponse = {
        employee: ({} as unknown) as OrgChartEmployee,
      };
      const request = '123';

      service.getParentEmployee(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/parent-employee?child_employee_id=123');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });
  describe('getWorldMap', () => {
    test('should get country data for world map', () => {
      const mock: WorldMapResponse = { data: [] };
      const request = ({} as unknown) as EmployeesRequest;

      service.getWorldMap(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/world-map');
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });

  describe('getAttritionOverTime', () => {
    test('should get attrition data for last years', () => {
      const request = ({} as unknown) as EmployeesRequest;
      const mock: AttritionOverTime = {
        events: [],
        data: {
          '2019': {
            attrition: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5],
            employees: [],
          },
        },
      };

      service.getAttritionOverTime(request).subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('/attrition-over-time');
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });
});
