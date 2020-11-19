import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import d3OrgChart from 'd3-org-chart';

import { getAttritionDataForEmployee } from '../../core/store/selectors';
import { AttritionDialogComponent } from '../../shared/attrition-dialog/attrition-dialog.component';
import { AttritionDialogModule } from '../../shared/attrition-dialog/attrition-dialog.module';
import { AttritionDialogMeta } from '../../shared/attrition-dialog/models/attrition-dialog-meta.model';
import { Employee } from '../../shared/models';
import { OrgChartComponent } from './org-chart.component';

describe('OrgChartComponent', () => {
  let component: OrgChartComponent;
  let spectator: Spectator<OrgChartComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: OrgChartComponent,
    detectChanges: false,
    imports: [MatProgressSpinnerModule, AttritionDialogModule],
    providers: [provideMockStore({})],
    declarations: [OrgChartComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set data', () => {
    test('should set chart data and update chart', () => {
      component.updateChart = jest.fn();
      component['orgChartService'].mapEmployeesToNodes = jest.fn();
      const employees = [({ employeeId: '123' } as unknown) as Employee];

      component.data = employees;

      expect(component.updateChart).toHaveBeenCalled();
      expect(
        component['orgChartService'].mapEmployeesToNodes
      ).toHaveBeenCalledWith(employees);
    });
  });

  describe('clickout', () => {
    test('should open dialog with attrition data when attrition icon is clicked', async () => {
      const mock = ({} as unknown) as AttritionDialogMeta;
      component['dialog'].open = jest.fn();
      store.overrideSelector(getAttritionDataForEmployee, mock);

      component.clickout({
        target: {
          classList: {
            contains: (elem: string) => elem === 'employee-node-attrition',
          },
          getAttribute: () => '123',
        },
      });

      await spectator.fixture.whenStable();

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
