import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { DataService, ENV_CONFIG } from '@schaeffler/http';

import {
  EMPLOYEE_MAP,
  EMPLOYEES,
  LEVEL_2_EMPLOYEE_A,
  LEVEL_2_EMPLOYEE_B,
  ROOT,
} from '../../../mocks/employees.mock';
import {
  Employee,
  EmployeesRequest,
  EmployeesResponse,
  InitialFiltersResponse,
} from '../models';
import { EmployeeService } from './employee.service';

describe('EmployeesService', () => {
  let httpMock: HttpTestingController;
  let service: EmployeeService;
  let spectator: SpectatorService<EmployeeService>;

  let root: Employee;
  let employeeMap: Map<string, Employee[]>;

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
    root = ROOT;
    employeeMap = EMPLOYEE_MAP;
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

  describe('getEmployees', () => {
    test('should get employees', () => {
      const mock: EmployeesResponse = { employees: [] };
      const request = ({} as unknown) as EmployeesRequest;
      service.mapEmployees = jest.fn(() => mock.employees);

      service.getEmployees(request).subscribe((response) => {
        expect(response).toEqual(mock);
        expect(service.mapEmployees).toHaveBeenCalledWith(mock.employees);
      });

      const req = httpMock.expectOne('/employees');
      expect(req.request.method).toBe('POST');
      req.flush(mock);
    });
  });

  describe('mapEmployees', () => {
    test('should set hierarchical data, enrich it and provide result as array', () => {
      service.createParentChildRelationFromEmployees = jest.fn(() => ({
        root,
        employeeMap,
      }));
      service.setNumberOfSubordinates = jest.fn();
      service.setAttrition = jest.fn();

      const expected = [root, LEVEL_2_EMPLOYEE_A, LEVEL_2_EMPLOYEE_B];

      const employees: Employee[] = [];

      const result = service.mapEmployees(employees);

      expect(result).toEqual(expected);
      expect(service.createParentChildRelationFromEmployees).toHaveBeenCalled();
      expect(service.setNumberOfSubordinates).toHaveBeenCalled();
      expect(service.setAttrition).toHaveBeenCalled();
    });
  });

  describe('createParentChildRelationFromEmployees', () => {
    test('should create correct map for given employees', () => {
      const result = service.createParentChildRelationFromEmployees(EMPLOYEES);

      expect(result.root).toEqual({ ...root, parentEmployeeId: '-1' });
      expect(result.employeeMap).toEqual(employeeMap);
    });
  });

  describe('setNumberOfSubordinates', () => {
    test('should recursively determine children', () => {
      const modifiedRoot = { ...root, parentEmployeeId: '-1' };
      employeeMap.set('-1', [modifiedRoot]);
      service.setNumberOfSubordinates(employeeMap, modifiedRoot, 0);

      expect(employeeMap.get('-1')[0].directSubordinates).toEqual(3);
      expect(employeeMap.get('-1')[0].totalSubordinates).toEqual(4);
      expect(employeeMap.get('-1')[0].level).toEqual(0);
      expect(employeeMap.get('123')[1].totalSubordinates).toEqual(1);
      expect(employeeMap.get('123')[1].directSubordinates).toEqual(1);
      expect(employeeMap.get('123')[1].level).toEqual(1);
      expect(employeeMap.get('123')[0].totalSubordinates).toEqual(0);
      expect(employeeMap.get('123')[0].directSubordinates).toEqual(0);
      expect(employeeMap.get('123')[0].level).toEqual(1);
      expect(employeeMap.get('789')[0].totalSubordinates).toEqual(0);
      expect(employeeMap.get('789')[0].directSubordinates).toEqual(0);
      expect(employeeMap.get('789')[0].level).toEqual(2);
    });
  });

  describe('setAttrition', () => {
    test('should recursively determine attrition', () => {
      const modifiedRoot = { ...root, parentEmployeeId: '-1' };
      employeeMap.set('-1', [modifiedRoot]);
      service.setAttrition(employeeMap, modifiedRoot);

      expect(employeeMap.get('-1')[0].directAttrition).toEqual(1);
      expect(employeeMap.get('-1')[0].totalAttrition).toEqual(2);
      expect(employeeMap.get('123')[1].totalAttrition).toEqual(1);
      expect(employeeMap.get('123')[1].directAttrition).toEqual(1);
      expect(employeeMap.get('123')[0].totalAttrition).toEqual(0);
      expect(employeeMap.get('123')[0].directAttrition).toEqual(0);
      expect(employeeMap.get('789')[0].totalAttrition).toEqual(0);
      expect(employeeMap.get('789')[0].directAttrition).toEqual(0);
    });
  });
});
