import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import d3OrgChart from 'd3-org-chart';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../assets/i18n/en.json';
import { EmployeeAttritionMeta } from '../../shared/models';
import { AttritionDialogComponent } from '..//attrition-dialog/attrition-dialog.component';
import { AttritionDialogModule } from '../attrition-dialog/attrition-dialog.module';
import { TeamMemberDialogModule } from '../team-member-dialog/team-member-dialog.module';
import { OrgChartEmployee } from './models/org-chart-employee.model';
import { OrgChartComponent } from './org-chart.component';

describe('OrgChartComponent', () => {
  let component: OrgChartComponent;
  let spectator: Spectator<OrgChartComponent>;

  const createComponent = createComponentFactory({
    component: OrgChartComponent,
    detectChanges: false,
    imports: [
      MatProgressSpinnerModule,
      AttritionDialogModule,
      TeamMemberDialogModule,
      provideTranslocoTestingModule({ en }),
      LoadingSpinnerModule,
    ],
    providers: [provideMockStore({})],
    declarations: [OrgChartComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set data', () => {
    test('should set chart data and update chart', () => {
      component.updateChart = jest.fn();
      component['orgChartService'].mapEmployeesToNodes = jest.fn();
      const employees = [
        ({ employeeId: '123' } as unknown) as OrgChartEmployee,
      ];

      component.data = employees;

      expect(component.updateChart).toHaveBeenCalled();
      expect(
        component['orgChartService'].mapEmployeesToNodes
      ).toHaveBeenCalledWith(employees);
    });
  });

  describe('clickout', () => {
    test('should open dialog with attrition data when attrition icon is clicked', () => {
      const mock = ({} as unknown) as EmployeeAttritionMeta;
      component['dialog'].open = jest.fn();
      component.data = [
        ({
          employeeId: '123',
          attritionMeta: mock,
        } as unknown) as OrgChartEmployee,
      ];

      component.clickout({
        target: {
          classList: {
            contains: (elem: string) => elem === 'employee-node-attrition',
          },
          getAttribute: () => '123',
        },
      });

      expect(
        component['dialog'].open
      ).toHaveBeenCalledWith(AttritionDialogComponent, { data: mock });
    });
  });

  describe('ngAfterViewInit', () => {
    test('should call update start and init org chart if not initialized yet', () => {
      component.updateChart = jest.fn();
      expect(component.chart).toBeUndefined();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();

      expect(component.chart).toBeDefined();
      expect(component.updateChart).toHaveBeenCalled();
    });
    test('should only call update start if chart already initialized', () => {
      component.updateChart = jest.fn();
      const chart = { test: '123' };
      component.chart = chart;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();

      expect(component.chart).toEqual(chart);
      expect(component.updateChart).toHaveBeenCalled();
    });
  });

  describe('updateChart', () => {
    test('should do nothing when chart is not initialized yet', (done) => {
      component.updateChart();

      expect(component.chart).toBeUndefined();

      setTimeout(() => {
        expect(component.chart).toBeUndefined();
        done();
      }, 200);
    });

    test('should update org chart if chart is set', (done) => {
      component.chart = new d3OrgChart();
      component.chartData = [{}];
      component.chartContainer = {
        nativeElement: {},
      };
      component.updateChart();

      setTimeout(() => {
        expect(component.chart.render).toHaveBeenCalled();
        done();
      }, 200);
    });
  });
});
