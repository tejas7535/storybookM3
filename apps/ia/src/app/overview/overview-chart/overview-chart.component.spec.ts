import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  LINE_CHART_BASE_OPTIONS,
  LINE_SERIES_BASE_OPTIONS,
} from '../../shared/charts/line-chart/line-chart.config';
import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../../shared/employee-list-dialog/employee-list-dialog.module';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { Employee, EmployeeWithAction } from '../../shared/models';
import { SharedModule } from '../../shared/shared.module';
import { OverviewChartComponent } from './overview-chart.component';

describe('OverviewChartComponent', () => {
  let component: OverviewChartComponent;
  let spectator: Spectator<OverviewChartComponent>;

  const createComponent = createComponentFactory({
    component: OverviewChartComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      MatCheckboxModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
      EmployeeListDialogModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set data', () => {
    it('should set correct chart configuration', () => {
      const data: any = {
        2020: {
          employees: [],
          attrition: [10, 20, 10],
        },
      };

      const expectedChartOptions = {
        ...LINE_CHART_BASE_OPTIONS,
        xAxis: {
          ...LINE_CHART_BASE_OPTIONS.xAxis,
          data: [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC',
          ],
        },
        yAxis: {
          type: 'value',
          name: 'Number of Employees',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontFamily: 'Roboto',
          },
        },
        series: [
          { ...LINE_SERIES_BASE_OPTIONS, name: '2020', data: [10, 20, 10] },
        ],
      };

      const exptectedChartSeries = [
        {
          name: '2020',
          checked: true,
        },
      ];

      component.data = data;

      expect(component.options).toEqual(expectedChartOptions);
      expect(component.chartSeries).toEqual(exptectedChartSeries);
    });
  });

  describe('onChartClick', () => {
    const employee: any = {
      employeeName: 'Tronald Dump',
      positionDescription: 'COO',
      orgUnit: 'Zirkus',
    };

    const data: {
      [seriesName: string]: {
        employees: Employee[][];
        attrition: number[];
      };
    } = {
      2020: {
        employees: [[employee], [], []],
        attrition: [10, 20, 10],
      },
    };

    it('should open the dialog with correct data', () => {
      const event = { dataIndex: 0, seriesName: '2020', name: 'Jan' };

      component['dialog'].open = jest.fn();

      component.data = data;
      component.showEmployees(event);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        {
          data: {
            headings: new EmployeeListDialogMetaHeadings(
              '2020 - Jan:',
              undefined
            ),
            employees: [],
            enoughRightsToShowAllEmployees: true,
            employeesLoading: component.attritionEmployeesData,
            showFluctuationType: undefined,
          },
        }
      );
    });

    it('should not open the dialog when not attrition', () => {
      const event = { dataIndex: 0, seriesName: '2020', name: 'Jan' };

      component['dialog'].open = jest.fn();
      data['2020'].attrition = [0, 0, 0];

      component.data = data;
      component.showEmployees(event);

      expect(component['dialog'].open).not.toHaveBeenCalled();
    });
  });

  describe('attritionEmployeesData', () => {
    test('should update dialog data', () => {
      const employees: EmployeeWithAction[] = [];
      const responseModified = false;
      const data = { employees, responseModified };

      component.attritionEmployeesData = data;

      expect(component.dialogData.employees).toBe(employees);
      expect(component.dialogData.enoughRightsToShowAllEmployees).toBeTruthy();
      expect(component.attritionEmployeesData).toBe(data);
    });
  });

  describe('attritionEmployeesLoading', () => {
    test('should update dialog employeesLoading', () => {
      component.dialogData.employeesLoading = true;

      component.attritionEmployeesLoading = false;

      expect(component.dialogData.employeesLoading).toBeFalsy();
      expect(component.attritionEmployeesLoading).toBeFalsy();
    });
  });
});
