import { translate } from '@ngneat/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ChartType } from '../../../../overview/models/chart-type.enum';
import { AttritionDialogMeta } from '../../../../shared/attrition-dialog/models/attrition-dialog-meta.model';
import {
  Employee,
  EmployeesRequest,
  Filter,
  FilterKey,
  IdValue,
  LeavingType,
  SelectedFilter,
} from '../../../../shared/models';
import { EmployeeService } from '../../../../shared/services/employee.service';
import {
  RouterStateUrl,
  selectEmployeeState,
  selectRouterState,
} from '../../reducers';
import {
  EmployeeState,
  selectAllSelectedEmployees,
} from '../../reducers/employee/employee.reducer';

export const getInitialFiltersLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.loading
);

export const getOrgUnits = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(FilterKey.ORG_UNIT, state.filters.orgUnits)
);

export const getRegionsAndSubRegions = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(
      FilterKey.REGION_OR_SUB_REGION,
      state.filters.regionsAndSubRegions
    )
);

export const getCountries = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(FilterKey.COUNTRY, state.filters.countries)
);

export const getHrLocations = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    new Filter(FilterKey.HR_LOCATION, state.filters.hrLocations)
);

export const getCurrentRoute = createSelector(
  selectRouterState,
  (state: RouterReducerState<RouterStateUrl>) => {
    return state?.state.url;
  }
);

export const getTimePeriods = createSelector(
  selectEmployeeState,
  (state: EmployeeState) =>
    state.filters.timePeriods.map(
      (period) =>
        new IdValue(
          period.id,
          translate(`filters.periodOfTime.${period.value}`)
        )
    )
);

export const getSelectedTimePeriod = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.selectedTimePeriod
);

export const getSelectedTimeRange = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.selectedTimeRange
);

export const getSelectedFilters = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.filters.selectedFilters
);

export const getAllSelectedFilters = createSelector(
  getSelectedFilters,
  selectAllSelectedEmployees
);

export const getCurrentFiltersAndTime = createSelector(
  getSelectedTimeRange,
  getAllSelectedFilters,
  (timeRange: string, filters: SelectedFilter[]) =>
    filters.reduce(
      (map: any, filter) => {
        map[filter.name] = filter.value;

        return map;
      },
      ({
        [FilterKey.TIME_RANGE]: timeRange,
      } as unknown) as EmployeesRequest
    )
);

export const getFilteredEmployees = createSelector(
  selectEmployeeState,
  getSelectedTimeRange,
  (state: EmployeeState, timeRange: string) => {
    // filter former employees and set correct number of direct and total subordinates
    const filteredResult = state.employees.result
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

export const getEmployeesLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.employees.loading
);

export const getSelectedOverviewChartType = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.overview.selectedChart
);

export const showRegionsAndLocationsFilters = createSelector(
  getCurrentRoute,
  getSelectedOverviewChartType,
  (route: string, type: ChartType) => {
    // hide if overview page and org chart (default) is selected
    return !(
      route &&
      route === `/${AppRoutePath.OverviewPath}` &&
      type === ChartType.ORG_CHART
    );
  }
);

export const getAttritionDataForEmployee = createSelector(
  selectEmployeeState,
  getSelectedTimeRange,
  (state: EmployeeState, timeRange: string, props: any) => {
    const selectedEmployee = state.employees.result.find(
      (employee) => employee.employeeId === props.employeeId
    );
    const allEmployees = state.employees.result.filter((employee) =>
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
