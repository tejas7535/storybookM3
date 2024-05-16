import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import {
  FilterChangedEvent,
  GridReadyEvent,
  SortChangedEvent,
} from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnDefinitionService } from '../config/column-definition-service';
import { CasesCriteriaSelection } from './cases-criteria-selection.enum';
import { CasesResultTableComponent } from './cases-result-table.component';
describe('CasesResultTableComponent', () => {
  let component: CasesResultTableComponent;
  let spectator: Spectator<CasesResultTableComponent>;

  const createComponent = createComponentFactory({
    component: CasesResultTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      MockProvider(ColumnDefinitionService, {
        COLUMN_DEFS: [],
      }),
      MockProvider(LocalizationService, {
        locale$: jest.fn(),
      } as unknown),
      MockProvider(ColumnUtilityService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize localeText$', () => {
      expect(component.localeText$).toBeDefined();
    });

    it('should call agGridStateService.init', () => {
      const initSpy = jest.spyOn(component['agGridStateService'], 'init');
      component.ngOnInit();
      expect(initSpy).toHaveBeenCalledWith(component['TABLE_KEY']);
    });
    test('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue = CasesCriteriaSelection.GQ_ID;
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.ngOnInit();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });
  });

  describe('radioButtonChanged', () => {
    test('should emit criteriaSelectedValue', () => {
      component.criteriaSelectedValue = CasesCriteriaSelection.GQ_ID;
      const emitSpy = jest.spyOn(component.criteriaSelected, 'emit');
      component.radioButtonChanged();
      expect(emitSpy).toHaveBeenCalledWith(component.criteriaSelectedValue);
    });
  });
  describe('onGridReady', () => {
    test('should apply ColumnState and filterState', () => {
      const columnState = {};
      const filterState = [
        {
          actionItemId: component['TABLE_KEY'],
          filterModels: { column1: { type: 'equals', filter: 'value' } },
        },
      ];
      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValue(columnState);
      const event: GridReadyEvent = {
        api: { setFilterModel: jest.fn() },
        columnApi: {
          applyColumnState: jest.fn(),
        },
      } as unknown as GridReadyEvent;

      component.onGridReady(event);
      component['agGridStateService'].filterState.next(filterState);

      expect(event.columnApi.applyColumnState).toHaveBeenCalled();
      expect(
        component['agGridStateService'].getColumnStateForCurrentView
      ).toHaveBeenCalled();

      expect(event.api.setFilterModel).toHaveBeenCalledWith(
        filterState[0].filterModels
      );
    });
  });

  describe('onColumnChange', () => {
    it('should call agGridStateService.setColumnStateForCurrentView', () => {
      const event = {
        columnApi: {
          getColumnState: jest.fn().mockReturnValue([]),
        },
      } as unknown as SortChangedEvent;
      const setColumnStateSpy = jest.spyOn(
        component['agGridStateService'],
        'setColumnStateForCurrentView'
      );
      component.onColumnChange(event);
      expect(setColumnStateSpy).toHaveBeenCalled();
    });
  });

  describe('onFilterChanged', () => {
    it('should call agGridStateService.setColumnFilterForCurrentView', () => {
      const event = {
        api: {
          getFilterModel: jest.fn().mockReturnValue({}),
        },
      } as unknown as FilterChangedEvent;
      const setColumnFilterSpy = jest.spyOn(
        component['agGridStateService'],
        'setColumnFilterForCurrentView'
      );
      component.onFilterChanged(event);
      expect(setColumnFilterSpy).toHaveBeenCalled();
    });
  });
});
