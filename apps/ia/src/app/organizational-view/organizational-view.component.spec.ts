import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { Employee } from '../shared/models/employee.model';
import { SharedModule } from '../shared/shared.module';
import { ChartType } from './models/chart-type.enum';
import { OrganizationalViewComponent } from './organizational-view.component';
import {
  chartTypeSelected,
  loadParent,
} from './store/actions/organizational-view.action';
import { ToggleChartsModule } from './toggle-charts/toggle-charts.module';

describe('OrganizationalViewComponent', () => {
  let component: OrganizationalViewComponent;
  let spectator: Spectator<OrganizationalViewComponent>;

  const createComponent = createComponentFactory({
    component: OrganizationalViewComponent,
    detectChanges: false,
    imports: [SharedModule, ToggleChartsModule],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should set observables', () => {
      component.ngOnInit();

      expect(component.orgChart$).toBeDefined();
      expect(component.isLoadingOrgChart$).toBeDefined();
    });
  });

  describe('chartTypeChanged', () => {
    test('should dispatch chart type', () => {
      component['store'].dispatch = jest.fn();
      const chartType = ChartType.WORLD_MAP;

      component.chartTypeChanged(chartType);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        chartTypeSelected({ chartType })
      );
    });
  });

  describe('loadParent', () => {
    test('should dispatch loadParent', () => {
      component['store'].dispatch = jest.fn();
      const employee = { employeeId: '123' } as unknown as Employee;

      component.loadParent(employee);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadParent({ employee })
      );
    });
  });
});
