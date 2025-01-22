import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutePath } from '@gq/app-route-path.enum';
import {
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { BaseResultTableComponent } from '@gq/shared/components/global-search-bar/base-result-table/base-result-table.component';
import { ColumnDefinitionService } from '@gq/shared/components/global-search-bar/config/column-definition-service';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import {
  ColumnState,
  FilterChangedEvent,
  GridReadyEvent,
  RowDoubleClickedEvent,
  SortChangedEvent,
} from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

describe('BaseResultTableComponent', () => {
  let component: BaseResultTableComponent;
  let spectator: Spectator<BaseResultTableComponent>;

  const createComponent = createComponentFactory({
    component: BaseResultTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      MockProvider(ColumnDefinitionService, {
        CASES_TABLE_COLUMN_DEFS: [],
      }),
      MockProvider(LocalizationService, {
        locale$: jest.fn(),
      } as unknown),
      MockProvider(ColumnUtilityService),
      MockProvider(AgGridStateService),
      mockProvider(TranslocoLocaleService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('onGridReady', () => {
    test('should apply ColumnState and filterState', () => {
      const tableKey = 'tableKey';
      const columnState: ColumnState[] = [{ colId: 'gqId', pinned: null }];
      const filterState = [
        {
          actionItemId: tableKey,
          filterModels: { column1: { type: 'equals', filter: 'value' } },
        },
      ];

      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValue(columnState);
      component['agGridStateService'].getColumnFiltersForCurrentView = jest
        .fn()
        .mockReturnValue(filterState);
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      const event: GridReadyEvent = {
        api: {
          setFilterModel: jest.fn(),
          applyColumnState: jest.fn(),
          setColumnsPinned: jest.fn(),
          getColumnState: jest.fn(),
        },
      } as unknown as GridReadyEvent;

      component.onGridReady(event, tableKey);

      expect(event.api.applyColumnState).toHaveBeenCalled();
      expect(event.api.setColumnsPinned).toHaveBeenCalled();
      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalled();
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
      const event: SortChangedEvent = {
        api: {
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
    test('should call agGridStateService.setColumnFilterForCurrentView', () => {
      const tableKey = 'tableKey';
      const event = {
        api: {
          getFilterModel: jest.fn().mockReturnValue({}),
        },
      } as unknown as FilterChangedEvent;
      const setColumnFilterSpy = jest.spyOn(
        component['agGridStateService'],
        'setColumnFilterForCurrentView'
      );
      component.onFilterChanged(event, tableKey);
      expect(setColumnFilterSpy).toHaveBeenCalled();
    });
  });

  describe('onRowDoubleClicked', () => {
    test('should navigate to the correct route', () => {
      const miscSpy = jest.spyOn(miscUtils, 'addMaterialFilterToQueryParams');
      const event = {
        context: {
          quotation_number: 'quotation_number',
          customer_number: 'customer_number',
          sales_org: 'sales_org',
        },
        data: {
          gqId: 'gqId',
          customerIdentifiers: {
            customerId: 'customerId',
            salesOrg: 'salesOrg',
          },
          status: 'status',
          enabledForApprovalWorkflow: 'enabledForApprovalWorkflow',
        },
      } as unknown as RowDoubleClickedEvent;
      const navigateSpy = jest.spyOn(component['router'], 'navigate');
      const determineCaseNavigationPathSpy = jest
        .spyOn(component['columnUtilityService'], 'determineCaseNavigationPath')
        .mockReturnValue([AppRoutePath.ProcessCaseViewPath]);
      const emitSpy = jest.spyOn(component.rowDoubleClicked, 'emit');

      component.onRowDoubleClicked(event);

      expect(determineCaseNavigationPathSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalled();
      expect(miscSpy).toHaveBeenCalled();
    });
  });
});
