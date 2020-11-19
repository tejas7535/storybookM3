import { Employee } from '../app/shared/models';

export const ROOT = ({
  employeeId: '123',
  parentEmployeeId: undefined,
  exitDate: undefined,
  totalSubordinates: 0,
  directSubordinates: 0,
  directAttrition: 0,
  totalAttrition: 0,
} as unknown) as Employee;

export const LEVEL_2_EMPLOYEE_A = ({
  employeeId: '456',
  parentEmployeeId: '123',
  exitDate: undefined,
  totalSubordinates: 0,
  directSubordinates: 0,
  directAttrition: 0,
  totalAttrition: 0,
} as unknown) as Employee;

export const LEVEL_2_EMPLOYEE_B = ({
  employeeId: '789',
  parentEmployeeId: '123',
  exitDate: undefined,
  totalSubordinates: 0,
  directSubordinates: 0,
  directAttrition: 0,
  totalAttrition: 0,
} as unknown) as Employee;

export const LEVEL_2_EMPLOYEE_C = ({
  employeeId: '13',
  parentEmployeeId: '123',
  exitDate: '2015-10-10',
  totalSubordinates: 0,
  directSubordinates: 0,
  directAttrition: 0,
  totalAttrition: 0,
  entryDate: '2010-10-10',
  terminationDate: '2015-08-10',
} as unknown) as Employee;

export const LEVEL_3_EMPLOYEE_A = ({
  employeeId: '33',
  parentEmployeeId: '789',
  exitDate: '2015-10-10',
  totalSubordinates: 0,
  directSubordinates: 0,
  directAttrition: 0,
  totalAttrition: 0,
} as unknown) as Employee;

export const EMPLOYEES: Employee[] = [
  ROOT,
  LEVEL_2_EMPLOYEE_A,
  LEVEL_2_EMPLOYEE_B,
  LEVEL_2_EMPLOYEE_C,
  LEVEL_3_EMPLOYEE_A,
];

const map = new Map<string, Employee[]>();
map.set('-1', [ROOT]);
map.set('123', [LEVEL_2_EMPLOYEE_A, LEVEL_2_EMPLOYEE_B, LEVEL_2_EMPLOYEE_C]);
map.set('789', [LEVEL_3_EMPLOYEE_A]);

export const EMPLOYEE_MAP = map;
