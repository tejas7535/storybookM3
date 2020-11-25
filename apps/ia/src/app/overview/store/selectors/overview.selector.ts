import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';
import { getSelectedTimeRange } from '../../../core/store/selectors';
import { AttritionDialogMeta } from '../../../shared/attrition-dialog/models/attrition-dialog-meta.model';
import { Employee, LeavingType } from '../../../shared/models';
import { EmployeeService } from '../../../shared/services/employee.service';

export const getSelectedChartType = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.selectedChart
);

export const getFilteredEmployeesForOrgChart = createSelector(
  selectOverviewState,
  getSelectedTimeRange,
  (state: OverviewState, timeRange: string) => {
    // filter former employees and set correct number of direct and total subordinates
    const filteredResult = state.orgChart
      .filter(
        (employee) =>
          !EmployeeService.employeeLeftInTimeRange(employee, timeRange)
      )
      .map((employee: Employee) => ({ ...employee }))
      .map((employee: Employee) => {
        employee.directSubordinates -= employee.directAttrition;
        employee.totalSubordinates -= employee.totalAttrition;

        return employee;
      });

    return filteredResult;
  }
);

export const getOrgChartLoading = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.loading
);

export const getAttritionDataForOrgchart = createSelector(
  selectOverviewState,
  getSelectedTimeRange,
  (state: OverviewState, timeRange: string, props: any) => {
    const selectedEmployee = state.orgChart.find(
      (employee) => employee.employeeId === props.employeeId
    );
    const allEmployees = state.orgChart.filter((employee) =>
      employee.orgUnit.startsWith(selectedEmployee.orgUnit)
    );
    const start = new Date(+timeRange.split('|')[0]);
    const end = new Date(+timeRange.split('|')[1]);

    const attritionRate = calculateAttritionRate(
      start,
      end,
      allEmployees,
      selectedEmployee
    );

    const employeesLost = selectedEmployee.totalAttrition;
    let naturalTurnover = 0;
    let forcedLeavers = 0;
    let unforcedLeavers = 0;
    let terminationReceived = 0;
    let employeesAdded = 0;
    const openPositions = 0;

    allEmployees.forEach((employee) => {
      forcedLeavers += employee.reasonForLeaving === LeavingType.FORCED ? 1 : 0;
      unforcedLeavers +=
        employee.reasonForLeaving === LeavingType.UNFORCED ? 1 : 0;
      naturalTurnover +=
        employee.reasonForLeaving === LeavingType.REMAINING ? 1 : 0;
      terminationReceived +=
        employee.terminationDate?.getTime() > end.getTime() ? 1 : 0;
      employeesAdded +=
        employee.entryDate?.getTime() >= start.getTime() &&
        employee.entryDate?.getTime() <= end.getTime()
          ? 1
          : 0;
    });

    return new AttritionDialogMeta(
      selectedEmployee.orgUnit,
      attritionRate,
      employeesLost,
      naturalTurnover,
      forcedLeavers,
      unforcedLeavers,
      terminationReceived,
      employeesAdded,
      openPositions
    );
  }
);

const calculateAttritionRate = (
  start: Date,
  end: Date,
  employees: Employee[],
  selectedEmployee: Employee
): number => {
  let months;
  const futureEnd = new Date(end.getTime());
  futureEnd.setMonth(end.getMonth() + 1);
  months = (futureEnd.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += futureEnd.getMonth();
  months = months <= 0 ? 0 : months;

  let numberOfTotalEmployees = 0;

  for (let i = 0; i < months; i += 1) {
    numberOfTotalEmployees += employees.filter((elem) => {
      let employeeUnvailable = false;

      const temp = new Date(start.getTime());
      temp.setMonth(temp.getMonth() + i);

      if (elem.exitDate) {
        // employee left that month
        employeeUnvailable =
          elem.exitDate.getFullYear() === temp.getFullYear() &&
          elem.exitDate.getMonth() === temp.getMonth();
      }

      if (elem.entryDate) {
        // employee joined company later
        employeeUnvailable =
          employeeUnvailable ||
          elem.entryDate.getFullYear() > temp.getFullYear() ||
          (elem.entryDate.getFullYear() === temp.getFullYear() &&
            elem.entryDate.getMonth() > temp.getMonth());
      }

      return !employeeUnvailable;
    }).length;
  }

  const attritionRate =
    ((selectedEmployee.totalAttrition / (numberOfTotalEmployees / months)) *
      100 *
      12) /
    months;

  return Math.round((attritionRate + Number.EPSILON) * 100) / 100;
};
