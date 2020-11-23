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
  LEVEL_2_EMPLOYEE_C,
  LEVEL_3_EMPLOYEE_A,
  ROOT,
} from '../../../mocks/employees-service.mock';
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
      service.fixIncomingEmployeeProps = jest.fn();

      const expected = [
        root,
        LEVEL_2_EMPLOYEE_A,
        LEVEL_2_EMPLOYEE_B,
        LEVEL_2_EMPLOYEE_C,
        LEVEL_3_EMPLOYEE_A,
      ];

      const employees: Employee[] = [];

      const result = service.mapEmployees(employees, '123|456');

      expect(result).toEqual(expected);
      expect(service.createParentChildRelationFromEmployees).toHaveBeenCalled();
      expect(service.setNumberOfSubordinates).toHaveBeenCalled();
      expect(service.setAttrition).toHaveBeenCalled();
      expect(service.fixIncomingEmployeeProps).toHaveBeenCalledWith(employees);
    });
  });

  describe('fixIncomingEmployeeProps', () => {
    test('should fix props', () => {
      const employees = [root, LEVEL_2_EMPLOYEE_C];

      const result = service.fixIncomingEmployeeProps(employees);

      expect(result).toEqual([
        root,
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
        } as unknown) as Employee,
      ]);
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
      EmployeeService.employeeLeftInTimeRange = jest.fn(
        (a, _b) => a.exitDate !== undefined
      );
      employeeMap.set('-1', [modifiedRoot]);
      service.setAttrition(
        employeeMap,
        modifiedRoot,
        '1577833200000|1609369200000'
      );

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
