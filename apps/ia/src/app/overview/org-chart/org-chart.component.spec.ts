import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import d3OrgChart from 'd3-org-chart';

import { Employee } from '../../shared/models';
import { OrgChartComponent } from './org-chart.component';

describe('OrgChartComponent', () => {
  let component: OrgChartComponent;
  let spectator: Spectator<OrgChartComponent>;

  const createComponent = createComponentFactory({
    component: OrgChartComponent,
    detectChanges: false,
    imports: [MatProgressSpinnerModule],
    providers: [],
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
      const employees = [({ employeeId: '123' } as unknown) as Employee];

      component.data = employees;

      expect(component.updateChart).toHaveBeenCalled();
      expect(
        component['orgChartService'].mapEmployeesToNodes
      ).toHaveBeenCalledWith(employees);
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
    test('should do nothing when chart is not initialized yet', () => {
      component.updateChart();

      expect(component.chart).toBeUndefined();
    });

    test('should update org chart if chart is set', () => {
      component.chart = new d3OrgChart();
      component.chartData = [{}];
      component.chartContainer = {
        nativeElement: {},
      };
      component.updateChart();

      expect(component.chart.render).toHaveBeenCalled();
    });
  });
});
