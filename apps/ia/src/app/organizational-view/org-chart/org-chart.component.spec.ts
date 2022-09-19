import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { OrgChart } from 'd3-org-chart';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../../shared/employee-list-dialog/employee-list-dialog.module';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { ChartType } from '../models/chart-type.enum';
import { DimensionFluctuationData } from '../models/dimension-fluctuation-data.model';
import { OrgChartComponent } from './org-chart.component';
import { OrgChartService } from './org-chart.service';

const mock: any = {
  attr: jest.fn(() => mock),
};

jest.mock('d3-selection', () => ({
  select: jest.fn(() => mock),
}));
describe('OrgChartComponent', () => {
  let component: OrgChartComponent;
  let spectator: Spectator<OrgChartComponent>;

  const createComponent = createComponentFactory({
    component: OrgChartComponent,
    detectChanges: false,
    imports: [
      MatProgressSpinnerModule,
      EmployeeListDialogModule,
      provideTranslocoTestingModule({ en }),
      LoadingSpinnerModule,
      MatDialogModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      OrgChartService,
    ],
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
      component['orgChartService'].mapOrgUnitsToNodes = jest.fn();
      const employees = [{ id: '123' } as unknown as DimensionFluctuationData];

      component.data = employees;

      expect(component.updateChart).toHaveBeenCalled();
      expect(
        component['orgChartService'].mapOrgUnitsToNodes
      ).toHaveBeenCalledWith(employees);
    });
  });

  describe('set chartContainer', () => {
    test('should set container and update chart if elementRef', () => {
      component.updateChart = jest.fn();
      component['_chartContainer'] = undefined;

      const ref = {} as unknown as ElementRef;

      component.chartContainer = ref;

      expect(component.chartContainer).toEqual(ref);
      expect(component.updateChart).toHaveBeenCalledTimes(1);
    });

    test('should do nothing when elementRef unavailable', () => {
      component.updateChart = jest.fn();
      component['_chartContainer'] = undefined;

      component.chartContainer = undefined;

      expect(component.chartContainer).toBeUndefined();
      expect(component.updateChart).not.toHaveBeenCalled();
    });
  });

  describe('clickout', () => {
    beforeEach(() => {
      component['dialog'].open = jest.fn();
      component.data = [
        {
          id: '123',
          parentId: '321',
          directLeafChildren: [],
          dimension: 'Schaeffler_IT',
          managerOfOrgUnit: 'Hans',
        } as DimensionFluctuationData,
      ];
    });
    test('should open dialog with attrition data when attrition icon is clicked', () => {
      component.loadMeta.emit = jest.fn();
      component.clickout({
        target: {
          id: 'employee-node-attrition',
          dataset: {
            id: '123',
          },
        },
      });

      expect(component.loadMeta.emit).toHaveBeenCalledWith(component.data[0]);
      expect(component['dialog'].open).toHaveBeenCalledWith(
        AttritionDialogComponent,
        {
          data: ChartType.ORG_CHART,
          width: '90%',
          maxWidth: '750px',
        }
      );
    });
    test('should open dialog with employee data when employee icon is clicked', () => {
      const data: EmployeeListDialogMeta = {
        headings: {
          header: 'Hans (Schaeffler_IT)',
          contentTitle: 'organizationalView.employeeListDialog.contentTitle',
        } as EmployeeListDialogMetaHeadings,
        employees: [] as any[],
        employeesLoading: false,
        enoughRightsToShowAllEmployees: true,
      };

      component.clickout({
        target: {
          id: 'employee-node-people',
          dataset: {
            id: '123',
          },
        },
      });

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        {
          data,
        }
      );
    });
    test('should emit showParent event if arrow up is clicked', () => {
      component.showParent.emit = jest.fn();

      component.clickout({
        target: {
          id: 'show-parent',
          dataset: {
            id: '123',
          },
        },
      });

      expect(component.showParent.emit).toHaveBeenCalledWith(component.data[0]);
    });
  });

  describe('ngAfterViewInit', () => {
    test('should call update start and init org chart if not initialized yet', fakeAsync(() => {
      component.updateChart = jest.fn();
      expect(component.chart).toBeUndefined();

      component.ngAfterViewInit();

      expect(component.chart).toBeDefined();
      tick();
      expect(component.updateChart).toHaveBeenCalled();
    }));

    test('should only call update start if chart already initialized', fakeAsync(() => {
      component.updateChart = jest.fn();
      const chart = { test: '123' };
      component.chart = chart;

      component.ngAfterViewInit();

      expect(component.chart).toEqual(chart);
      tick();
      expect(component.updateChart).toHaveBeenCalled();
    }));
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
      component.chart = new OrgChart();
      component.chartData = [{}];
      component.chartContainer = {
        nativeElement: {
          getBoundingClientRect: jest.fn(() => ({ height: 20 })),
        },
      };

      component.updateChart();

      setTimeout(() => {
        expect(component.chart.render).toHaveBeenCalled();
        expect(component.chart.fit).toHaveBeenCalled();
        done();
      }, 200);
    });
  });
});
