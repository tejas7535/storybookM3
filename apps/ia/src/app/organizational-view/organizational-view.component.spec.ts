import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '../shared/shared.module';
import { ChartType } from './models/chart-type.enum';
import { OrgChartEmployee } from './org-chart/models/org-chart-employee.model';
import { OrgChartModule } from './org-chart/org-chart.module';
import { OrganizationalViewComponent } from './organizational-view.component';
import {
  chartTypeSelected,
  loadParent,
} from './store/actions/organizational-view.action';
import { ToggleChartsModule } from './toggle-charts/toggle-charts.module';
import { WorldMapModule } from './world-map/world-map.module';

describe('OrganizationalViewComponent', () => {
  let component: OrganizationalViewComponent;
  let spectator: Spectator<OrganizationalViewComponent>;

  const createComponent = createComponentFactory({
    component: OrganizationalViewComponent,
    detectChanges: false,
    imports: [SharedModule, OrgChartModule, ToggleChartsModule, WorldMapModule],
    providers: [provideMockStore({})],
    declarations: [OrganizationalViewComponent],
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
      const employee = { employeeId: '123' } as unknown as OrgChartEmployee;

      component.loadParent(employee);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadParent({ employee })
      );
    });
  });
});
