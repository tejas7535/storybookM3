import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { AttritionQuotaDetailsModule } from './attrition-quota-details/attrition-quota-details.module';
import { ChartType } from './models/chart-type.enum';
import { OrgChartEmployee } from './org-chart/models/org-chart-employee.model';
import { OrgChartModule } from './org-chart/org-chart.module';
import { OverviewComponent } from './overview.component';
import { chartTypeSelected, loadParent } from './store/actions/overview.action';
import { ToggleChartsModule } from './toggle-charts/toggle-charts.module';
import { WorldMapModule } from './world-map/world-map.module';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let spectator: Spectator<OverviewComponent>;

  const createComponent = createComponentFactory({
    component: OverviewComponent,
    detectChanges: false,
    imports: [
      OrgChartModule,
      ReactiveComponentModule,
      ToggleChartsModule,
      WorldMapModule,
      AttritionQuotaDetailsModule,
      TranslocoTestingModule,
    ],
    providers: [provideMockStore({})],
    declarations: [OverviewComponent],
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
      // tslint:disable-next-line: no-lifecycle-call
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
      const employee = ({ employeeId: '123' } as unknown) as OrgChartEmployee;

      component.loadParent(employee);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadParent({ employee })
      );
    });
  });
});
