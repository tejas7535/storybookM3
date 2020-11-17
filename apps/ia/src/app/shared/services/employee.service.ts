import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import {
  Employee,
  EmployeesRequest,
  EmployeesResponse,
  InitialFiltersResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly INITIAL_FILTERS = 'initial-filters';
  private readonly EMPLOYEES = 'employees';

  public constructor(private readonly dataService: DataService) {}

  public getInitialFilters(): Observable<InitialFiltersResponse> {
    return this.dataService.getAll<InitialFiltersResponse>(
      this.INITIAL_FILTERS
    );
  }

  public getEmployees(
    employeesRequest: EmployeesRequest
  ): Observable<Employee[]> {
    return this.dataService
      .post<EmployeesResponse>(this.EMPLOYEES, employeesRequest)
      .pipe(
        map((employeesResponse) =>
          this.mapEmployees(employeesResponse.employees, employeesRequest)
        )
      );
  }

  public mapEmployees(
    employees: Employee[],
    request: EmployeesRequest
  ): Employee[] {
    // fix date props
    const modifiedEmployees = employees.map((employee) => {
      employee.exitDate = employee.exitDate
        ? new Date(employee.exitDate)
        : undefined;
      employee.terminationDate = employee.terminationDate
        ? new Date(employee.terminationDate)
        : undefined;

      return employee;
    });

    // create map that contains parent <-> children relations
    const { root, employeeMap } = this.createParentChildRelationFromEmployees(
      modifiedEmployees
    );

    // enrich map with information about number of direct and total subordinates
    this.setNumberOfSubordinates(employeeMap, root, 0);

    // enrich map with information about direct and total attrition
    this.setAttrition(employeeMap, root);

    // set root back to undefined
    root.parentEmployeeId = undefined;

    // flatten map to array
    const result = [...employeeMap.values()].reduce((a, b) => a.concat(b), []);

    // filter former employees and correct number of direct and total subordinates
    const filteredResult = result
      .filter((employee) =>
        this.employeeLeftInTimeRange(employee, request.timeRange)
      )
      .map((employee: Employee) => {
        employee.directSubordinates =
          employee.directSubordinates - employee.directAttrition;
        employee.totalSubordinates -= employee.totalAttrition;

        return employee;
      });

    return filteredResult;
  }

  public createParentChildRelationFromEmployees(
    employees: Employee[]
  ): { root: Employee; employeeMap: Map<string, Employee[]> } {
    const employeeMap: Map<string, Employee[]> = new Map<string, Employee[]>();
    const rootKey = '-1';
    let root;

    for (const employee of employees) {
      let key = employee.parentEmployeeId;
      employee.totalSubordinates = 0;
      employee.directSubordinates = 0;
      employee.directAttrition = 0;
      employee.totalAttrition = 0;

      if (!employee.parentEmployeeId) {
        employee.parentEmployeeId = rootKey;
        key = rootKey;
        root = employee;
      }
      if (employeeMap.get(key) === undefined) {
        employeeMap.set(key, []);
      }

      employeeMap.get(key).push(employee);
    }

    return { root, employeeMap };
  }

  public employeeLeftInTimeRange(
    employee: Employee,
    timeRange: string
  ): boolean {
    return (
      !employee.exitDate ||
      employee.exitDate.getTime() < +timeRange.split('|')[0] ||
      employee.exitDate.getTime() > +timeRange.split('|')[1]
    );
  }

  public setNumberOfSubordinates(
    employeeMap: Map<string, Employee[]>,
    parent: Employee,
    currentLevel: number
  ): any {
    parent.level = currentLevel;
    const children = employeeMap.get(parent.employeeId);
    parent.directSubordinates = children?.length ?? 0;

    // node does not exist -> leaf node without children
    if (!children) {
      return 1;
    }

    children.forEach((employee, _parent, _map) => {
      const nrOfChildren = this.setNumberOfSubordinates(
        employeeMap,
        employee,
        currentLevel + 1
      );

      parent.totalSubordinates += nrOfChildren;
    });

    return parent.totalSubordinates + 1;
  }

  public setAttrition(
    employeeMap: Map<string, Employee[]>,
    parent: Employee
  ): any {
    const children = employeeMap.get(parent.employeeId);
    parent.directAttrition =
      children?.reduce((a, b) => a + (b.exitDate ? 1 : 0), 0) ?? 0;

    if (!children) {
      return parent.exitDate ? 1 : 0;
    }

    children.forEach((employee, _parent, _map) => {
      const attrition = this.setAttrition(employeeMap, employee);

      parent.totalAttrition += attrition;
    });

    return parent.totalAttrition + (parent.exitDate ? 1 : 0);
  }
}
