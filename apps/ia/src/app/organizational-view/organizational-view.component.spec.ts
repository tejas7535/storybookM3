import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '../shared/shared.module';
import { ChartType } from './models/chart-type.enum';
import { DimensionFluctuationData } from './models/dimension-fluctuation-data.model';
import { OrganizationalViewComponent } from './organizational-view.component';
import {
  chartTypeSelected,
  loadOrgChartEmployees,
  loadOrgChartFluctuationMeta,
  loadParent,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMapFluctuationRegionMeta,
} from './store/actions/organizational-view.action';
import { ToggleChartsModule } from './toggle-charts/toggle-charts.module';

describe('OrganizationalViewComponent', () => {
  let component: OrganizationalViewComponent;
  let spectator: Spectator<OrganizationalViewComponent>;

  const createComponent = createComponentFactory({
    component: OrganizationalViewComponent,
    detectChanges: false,
    imports: [SharedModule, ToggleChartsModule],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
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
      expect(component.isLoadingWorldMap$).toBeDefined();
      expect(component.selectedChartType$).toBeDefined();
      expect(component.worldMap$).toBeDefined();
      expect(component.regions$).toBeDefined();
      expect(component.selectedTimeRange$).toBeDefined();
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
      const orgUnit = { id: '123' } as unknown as DimensionFluctuationData;

      component.loadParent(orgUnit);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadParent({ data: orgUnit })
      );
    });
  });

  describe('loadFluctuationMeta', () => {
    test('should dispatch loadOrgUnitFluctuationMeta', () => {
      component['store'].dispatch = jest.fn();
      const orgUnit = { id: '123' } as unknown as DimensionFluctuationData;

      component.loadFluctuationMeta(orgUnit);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadOrgChartFluctuationMeta({ data: orgUnit })
      );
    });
  });
  describe('loadRegionMeta', () => {
    test('should dispatch loadWorldMapFluctuationRegionMeta', () => {
      component['store'].dispatch = jest.fn();
      const region = 'Europe';

      component.loadRegionMeta(region);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadWorldMapFluctuationRegionMeta({ region })
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
    });
  });

  describe('loadOrgChartEmployees', () => {
    test('should dispatch loadOrgChartEmployees', () => {
      component['store'].dispatch = jest.fn();
      const data = { id: '123' } as unknown as DimensionFluctuationData;

      component.loadOrgChartEmployees(data);

      expect(component['store'].dispatch).toHaveBeenCalledWith(
        loadOrgChartEmployees({ data })
      );
    });
  });
});
