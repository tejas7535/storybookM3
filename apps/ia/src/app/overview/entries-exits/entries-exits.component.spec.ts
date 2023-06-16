import { ComponentFixture } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ExternalLegendComponent } from '../../shared/charts/external-legend/external-legend.component';
import { LooseDoughnutChartComponent } from '../../shared/charts/loose-doughnut-chart/loose-doughnut-chart.component';
import { LegendSelectAction } from '../../shared/charts/models';
import { ChartLegendItem } from '../../shared/charts/models/chart-legend-item.model';
import { DoughnutConfig } from '../../shared/charts/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../shared/charts/models/doughnut-series-config.model';
import { KpiModule } from '../../shared/kpi/kpi.module';
import { FilterDimension } from '../../shared/models';
import { Color } from '../../shared/models/color.enum';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { initialState } from '../store';
import { EntriesExitsComponent } from './entries-exits.component';

describe('EntriesExitsComponent', () => {
  let component: EntriesExitsComponent;
  let spectator: Spectator<EntriesExitsComponent>;
  let fixture: ComponentFixture<EntriesExitsComponent>;

  const createComponent = createComponentFactory({
    component: EntriesExitsComponent,
    detectChanges: false,
    providers: [
      provideMockStore({
        ...initialState,
        initialState: {
          overview: {
            fluctuationRates: {
              data: {
                employees: [],
              },
              loading: false,
              errorMessage: undefined,
            },
          },
          filter: {
            selectedFilters: {
              ids: [FilterDimension.ORG_UNIT],
              entities: {
                orgUnit: {
                  name: FilterDimension.ORG_UNIT,
                  value: 'Schaeffler_IT_1',
                },
              },
            },
          },
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    imports: [
      SharedModule,
      provideTranslocoTestingModule({ en: {} }),
      KpiModule,
      SharedPipesModule,
      MatIconModule,
      MatTooltipModule,
    ],
    declarations: [
      MockComponent(LooseDoughnutChartComponent),
      MockComponent(ExternalLegendComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    fixture = spectator.fixture;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    test('should create template', () => {
      component.entriesDoughnutConfig = new DoughnutConfig('Demo Entries', [
        new DoughnutSeriesConfig([{ value: 23 }], 'entries', Color.WHITE),
      ]);
      component.exitsDoughnutConfig = new DoughnutConfig('Demo Exits', [
        new DoughnutSeriesConfig([{ value: 23 }], 'exits', Color.BLACK),
      ]);
      component.entriesCount = 65;
      component.exitsCount = 72;
      component.exitEmployees = [];
      component.totalEmployeesCount = 500;

      fixture.detectChanges();

      const kpiValues = fixture.debugElement
        .queryAll(By.css('h4'))
        .map((element) => element.nativeElement.textContent);
      const charts = fixture.debugElement.queryAll(
        By.css('ia-loose-doughnut-chart')
      );

      expect(kpiValues.length).toEqual(3);
      expect(kpiValues).toContainEqual(component.entriesCount.toString());
      expect(kpiValues).toContainEqual(component.exitsCount.toString());
      expect(charts.length).toEqual(2);
    });
  });

  describe('set data', () => {
    test('should set data', () => {
      const data: [DoughnutConfig, DoughnutConfig] = [
        new DoughnutConfig('donnut 1', []),
        new DoughnutConfig('donnut 2', []),
      ];

      component.data = data;

      expect(component.entriesDoughnutConfig).toEqual(data[0]);
      expect(component.exitsDoughnutConfig).toEqual(data[1]);
    });
  });

  describe('set dimensionHint', () => {
    test('should set dimensionHint and create legend', () => {
      const dimensionHint = 'test';

      component.createLegend = jest.fn();
      component.dimensionHint = dimensionHint;

      expect(component.dimensionHint).toEqual(dimensionHint);
      expect(component.createLegend).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSelectedLegendItem', () => {
    test('should set legend select action', () => {
      const action: LegendSelectAction = { dog: true };

      component.onSelectedLegendItem(action);

      expect(component.legendSelectAction).toBe(action);
    });
  });

  describe('createLegend', () => {
    test('should create legend', () => {
      component.createLegend();

      expect(component.legend).toEqual([
        new ChartLegendItem('translate it', Color.LIME, 'translate it', true),
        new ChartLegendItem(
          'translate it',
          Color.LIGHT_BLUE,
          'translate it',
          true
        ),
      ]);
    });
  });

  describe('triggerExitEmployeesAction', () => {
    test('should emit loadExitEmployees', () => {
      component.loadExitEmployees.emit = jest.fn();

      component.triggerExitEmployeesAction();

      expect(component.loadExitEmployees.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerEntryEmployeesAction', () => {
    test('should emit loadEntryEmployees', () => {
      component.loadEntryEmployees.emit = jest.fn();

      component.triggerEntryEmployeesAction();

      expect(component.loadEntryEmployees.emit).toHaveBeenCalledTimes(1);
    });
  });
});
