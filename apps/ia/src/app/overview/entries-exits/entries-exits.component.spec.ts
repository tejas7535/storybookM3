import { ComponentFixture } from '@angular/core/testing';
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
import { KpiModule } from '../../shared/kpi/kpi.module';
import { FilterDimension } from '../../shared/models';
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
      component.entriesCount = 65;
      component.exitsCount = 72;
      component.exitEmployees = [];
      component.totalEmployeesCount = 500;

      fixture.detectChanges();

      const kpiValues = fixture.debugElement
        .queryAll(By.css('h4'))
        .map((element) => element.nativeElement.textContent);

      const trimmedKpiValues = kpiValues.map((value) => value.trim());
      expect(trimmedKpiValues.length).toEqual(3);
      expect(trimmedKpiValues).toContainEqual(`${component.entriesCount}`);
      expect(trimmedKpiValues).toContainEqual(`${component.exitsCount}`);
    });
  });

  describe('set dimensionHint', () => {
    test('should set dimensionHint and create legend', () => {
      const dimensionHint = 'test';

      component.dimensionHint = dimensionHint;

      expect(component.dimensionHint).toEqual(dimensionHint);
    });
  });

  describe('onSelectedLegendItem', () => {
    test('should set legend select action', () => {
      const action: LegendSelectAction = { dog: true };

      component.onSelectedLegendItem(action);

      expect(component.legendSelectAction).toBe(action);
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
