import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../assets/i18n/en.json';
import { filterSelected } from '../core/store/actions';
import { FilterDimension } from '../shared/models';
import { SharedModule } from '../shared/shared.module';
import { DrillDownToolPanelModule } from './drill-down-tool-panel/drill-down-tool-panel.module';
import { ChartType, DimensionFluctuationData } from './models';
import { OrgChartTranslation } from './org-chart/models';
import { OrganizationalViewComponent } from './organizational-view.component';
import {
  chartTypeSelected,
  loadChildAttritionOverTimeForWorldMap,
  loadOrgChartEmployees,
  loadParent,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMapFluctuationRegionMeta,
} from './store/actions/organizational-view.action';
import { getOrgChart } from './store/selectors/organizational-view.selector';

jest.mock('d3-selection', () => ({
  select: jest.fn(() => mock),
}));

describe('OrganizationalViewComponent', () => {
  let component: OrganizationalViewComponent;
  let spectator: Spectator<OrganizationalViewComponent>;
  let transloco: TranslocoService;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: OrganizationalViewComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      DrillDownToolPanelModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    transloco = spectator.inject(TranslocoService);
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should set observables', () => {
      component.ngOnInit();

      expect(component.orgChart$).toBeDefined();
      expect(component.isLoadingOrgChart$).toBeDefined();
      expect(component.isLoadingWorldMap$).toBeDefined();
      expect(component.selectedChartType$).toBeDefined();
      expect(component.worldMap$).toBeDefined();
      expect(component.regions$).toBeDefined();
      expect(component.selectedTimeRange$).toBeDefined();
    });
  });

  describe('selectOrgChartWithTranslation', () => {
    test(
      'should select org chart with translation',
      marbles((m) => {
        const translation: OrgChartTranslation = {
          columnDirect: 'Direct',
          columnOverall: 'Overall',
          rowAttrition: 'Attrition',
          rowEmployees: 'Employees',
        };
        transloco.selectTranslateObject = jest.fn(() =>
          of(translation as OrgChartTranslation as any)
        );

        store.overrideSelector(getOrgChart, {
          data: [],
          dimension: FilterDimension.COUNTRY,
        });

        const action = component.selectOrgChartWithTranslation();

        const expected = m.cold('a', {
          a: {
            data: [],
            dimension: FilterDimension.COUNTRY,
            translation,
          } as any,
        });
        m.expect(action).toBeObservable(expected);
      })
    );
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

  describe('fluctuationTypeChanged', () => {
    test('should set selectedFluctuationType', () => {
      const fluctuationType = 'test' as any;

      component.fluctuationTypeChanged(fluctuationType);

      expect(component.selectedFluctuationType).toBe(fluctuationType);
    });
  });

  describe('loadParent', () => {
    test('should dispatch loadParent', () => {
      component['store'].dispatch = jest.fn();
      const orgUnit = { id: '123' } as DimensionFluctuationData;

      component.loadParent(orgUnit);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadParent({ data: orgUnit })
      );
    });
  });

  describe('loadChildAttritionOverTime', () => {
    test('should dispatch loadWorldMapFluctuationRegionMeta and loadChildAttritionOverTimeForWorldMap', () => {
      component['store'].dispatch = jest.fn();
      const region = 'Europe';

      component.loadRegionMeta(region);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadWorldMapFluctuationRegionMeta({ region })
      );
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadChildAttritionOverTimeForWorldMap({
          filterDimension: FilterDimension.REGION,
          dimensionName: region,
        })
      );
    });
  });

  describe('loadCountryMeta', () => {
    test('should dispatch loadWorldMapFluctuationCountryMeta', () => {
      component['store'].dispatch = jest.fn();
      const country = 'Germany';

      component.loadCountryMeta(country);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadWorldMapFluctuationCountryMeta({ country })
      );
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadChildAttritionOverTimeForWorldMap({
          filterDimension: FilterDimension.COUNTRY,
          dimensionName: country,
        })
      );
    });
  });

  describe('loadOrgChartEmployees', () => {
    test('should dispatch loadOrgChartEmployees', () => {
      component['store'].dispatch = jest.fn();
      const data = { id: '123' } as DimensionFluctuationData;

      component.loadOrgChartEmployees(data);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadOrgChartEmployees({ data })
      );
    });
  });

  describe('changeSelectedDimensionFilter', () => {
    test('should dispatch filterSelected when dimension org unit', () => {
      component['store'].dispatch = jest.fn();
      const data = {
        dimension: 'A',
        dimensionKey: '1',
        dimensionLongName: 'B',
        filterDimension: FilterDimension.ORG_UNIT,
      } as unknown as DimensionFluctuationData;

      component.changeSelectedDimensionFilter(data);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        filterSelected({
          filter: {
            idValue: {
              id: '1',
              value: 'A (B)',
            },
            name: FilterDimension.ORG_UNIT,
          },
        })
      );
    });

    test('should dispatch filterSelected when dimension country', () => {
      component['store'].dispatch = jest.fn();
      const data = {
        dimension: 'A',
        dimensionKey: '1',
        filterDimension: FilterDimension.COUNTRY,
      } as unknown as DimensionFluctuationData;

      component.changeSelectedDimensionFilter(data);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        filterSelected({
          filter: {
            idValue: {
              id: '1',
              value: 'A',
            },
            name: FilterDimension.COUNTRY,
          },
        })
      );
    });
  });

  describe('exportImg', () => {
    test('should call orgChartComponent.exportImg', () => {
      component.orgChartComponent = {
        exportImg: jest.fn(),
      } as any;

      component.exportImg();

      expect(component.orgChartComponent.exportImg).toHaveBeenCalled();
    });
  });

  describe('expandAll', () => {
    test('should call orgChartComponent.expandAll', () => {
      component.orgChartComponent = {
        expandAll: jest.fn(),
      } as any;

      component.expandAll();

      expect(component.orgChartComponent.expandAll).toHaveBeenCalled();
    });
  });

  describe('collapseAll', () => {
    test('should call orgChartComponent.collapseAll', () => {
      component.orgChartComponent = {
        collapseAll: jest.fn(),
      } as any;

      component.collapseAll();

      expect(component.orgChartComponent.collapseAll).toHaveBeenCalled();
    });
  });

  describe('zoomIn', () => {
    test('should call orgChartComponent.zoomIn', () => {
      component.selectedChartType = ChartType.ORG_CHART;
      component.orgChartComponent = {
        zoomIn: jest.fn(),
      } as any;

      component.zoomIn();

      expect(component.orgChartComponent.zoomIn).toHaveBeenCalled();
    });

    test('should call worldMapComponent.zoomIn', () => {
      component.selectedChartType = ChartType.WORLD_MAP;
      component.worldMapComponent = {
        zoomIn: jest.fn(),
      } as any;

      component.zoomIn();

      expect(component.worldMapComponent.zoomIn).toHaveBeenCalled();
    });
  });

  describe('zoomOut', () => {
    test('should call orgChartComponent.zoomOut', () => {
      component.selectedChartType = ChartType.ORG_CHART;
      component.orgChartComponent = {
        zoomOut: jest.fn(),
      } as any;

      component.zoomOut();

      expect(component.orgChartComponent.zoomOut).toHaveBeenCalled();
    });

    test('should call worldMapComponent.zoomOut', () => {
      component.selectedChartType = ChartType.WORLD_MAP;
      component.worldMapComponent = {
        zoomOut: jest.fn(),
      } as any;

      component.zoomOut();

      expect(component.worldMapComponent.zoomOut).toHaveBeenCalled();
    });
  });

  describe('zoomToFit', () => {
    test('should call orgChartComponent.zoomToFit', () => {
      component.selectedChartType = ChartType.ORG_CHART;
      component.orgChartComponent = {
        zoomToFit: jest.fn(),
      } as any;

      component.zoomToFit();

      expect(component.orgChartComponent.zoomToFit).toHaveBeenCalled();
    });

    test('should call worldMapComponent.zoomToFit', () => {
      component.selectedChartType = ChartType.WORLD_MAP;
      component.worldMapComponent = {
        zoomToFit: jest.fn(),
      } as any;

      component.zoomToFit();

      expect(component.worldMapComponent.zoomToFit).toHaveBeenCalled();
    });
  });
});
