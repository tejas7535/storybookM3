import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import { OrgChartEmployee } from '../../overview/org-chart/models/org-chart-employee.model';
import {
  EmployeesRequest,
  InitialFiltersResponse,
  OrgChartResponse,
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
      service.fixIncomingEmployeeProps = jest.fn();

      service.getOrgChart(request).subscribe((response) => {
        expect(response).toEqual(mock);
        expect(service.fixIncomingEmployeeProps).toHaveBeenCalledWith(
          mock.employees
        );
      });

      const req = httpMock.expectOne('/org-chart');
      expect(req.request.method).toBe('POST');
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
      const employees = [elem];

      const result = service.fixIncomingEmployeeProps(employees);

      expect(result).toEqual([
        ({
          employeeId: '13',
          parentEmployeeId: '123',
          exitDate: new Date('2015-10-10'),
          totalSubordinates: 0,
          directSubordinates: 0,
          directAttrition: 0,
          totalAttrition: 0,
          entryDate: new Date('2010-10-10'),
          terminationDate: new Date('2015-08-10'),
        } as unknown) as OrgChartEmployee,
      ]);
    });
  });
});
