import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { of } from 'rxjs';

import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { CaseTableColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { QuotationStatus } from '@gq/shared/models';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ColumnState,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  RowNode,
} from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  VIEW_CASE_STATE_MOCK,
} from '../../../testing/mocks';
import { AppRoutePath } from '../../app-route-path.enum';
import { CaseTableComponent } from './case-table.component';
import { ColumnDefService } from './config/column-def.service';
import { CASE_TABLE_CUSTOM_VIEWS_CONFIG } from './config/custom-views.config';

describe('CaseTableComponent', () => {
  let component: CaseTableComponent;
  let spectator: Spectator<CaseTableComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: CaseTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      provideRouter([]),
      MockProvider(ColumnDefService, {
        COLUMN_DEFS: [],
      }),
      MockProvider(AgGridStateService),
      MockProvider(LocalizationService),
      MockProvider(ColumnUtilityService),
      provideMockStore({
        initialState: {
          case: VIEW_CASE_STATE_MOCK,
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    test('should emit', () => {
      component['unsubscribe$'].next = jest.fn();
      component['unsubscribe$'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['unsubscribe$'].next).toHaveBeenCalled();
      expect(component['unsubscribe$'].unsubscribe).toHaveBeenCalled();
    });
    test('should save userSettings', () => {
      component['agGridStateService'].saveUserSettings = jest.fn();

      component.ngOnDestroy();

      expect(
        component['agGridStateService'].saveUserSettings
      ).toHaveBeenCalled();
    });
  });

  describe('on init', () => {
    test('should init agGridState', () => {
      const TABLE_KEY = 'CASE_OVERVIEW';
      component.activeTab = QuotationTab.ACTIVE;
      component['agGridStateService'].init = jest.fn();
      component['agGridStateService'].setActiveView = jest.fn();

      component['overviewCasesFacade'].selectedIds$ = of([]);

      component.ngOnInit();

      expect(component['agGridStateService'].init).toHaveBeenCalledWith(
        TABLE_KEY,
        CASE_TABLE_CUSTOM_VIEWS_CONFIG
      );
      expect(
        component['agGridStateService'].setActiveView
      ).toHaveBeenCalledWith(0);
    });
    test('should take selected cases from the store', () => {
      const selectedIds = [1234];
      const overviewCasesFacadeMock: OverviewCasesFacade = {
        selectedIds$: of(selectedIds),
      } as unknown as OverviewCasesFacade;
      Object.defineProperty(component, 'overviewCasesFacade', {
        value: overviewCasesFacadeMock,
      });

      expect(component.selectedRows).toEqual(undefined);
      component.ngOnInit();
      expect(component.selectedRows).toEqual(selectedIds);
    });
  });

  describe('columnChange', () => {
    let event: any;
    const filterModels = {
      quotationItemId: { filterType: 'set', values: ['20'] },
    };
    beforeEach(() => {
      event = {
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
          getFilterModel: jest.fn(() => filterModels),
          getColumnState: jest.fn(),
        },
      } as any;

      component['agGridStateService'].setColumnData = jest.fn();
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      component['agGridStateService'].setColumnFilterForCurrentView = jest.fn();

      component.activeTab = QuotationTab.ACTIVE;
    });

    test('should set column state', () => {
      component['agGridStateService'].getCurrentViewId = jest
        .fn()
        .mockReturnValue(1);

      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
    });

    test('should set column filters', () => {
      component['agGridStateService'].getCurrentViewId = jest
        .fn()
        .mockReturnValue(1);

      component.onFilterChanged(event);

      expect(event.api.getFilterModel).toHaveBeenCalledTimes(1);
      expect(
        component['agGridStateService'].setColumnFilterForCurrentView
      ).toHaveBeenCalledTimes(1);
      expect(
        component['agGridStateService'].setColumnFilterForCurrentView
      ).toHaveBeenCalledWith(component.activeTab, filterModels);
    });
  });

  describe('onGridReady', () => {
    test('should select rows from state', () => {
      const nodes = [
        { data: { gqId: 1234 }, setSelected: jest.fn() } as any,
        { data: { gqId: 5678 }, setSelected: jest.fn() } as any,
      ];
      const mockEvent = {
        api: {
          forEachNode: (callback: (row: RowNode) => void) =>
            nodes.forEach((element) => {
              callback(element);
            }),
          applyColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValue([{ colId: '1' } as ColumnState]);
      component['agGridStateService'].getColumnFiltersForCurrentView = jest
        .fn()
        .mockReturnValue([]);

      component.selectedRows = [1234];
      component.onGridReady(mockEvent);

      expect(nodes[0].setSelected).toHaveBeenCalledWith(true);
      expect(nodes[1].setSelected).not.toHaveBeenCalled();
    });

    test('should apply column state and filter model', () => {
      const mockEvent = {
        api: {
          forEachNode: jest.fn(),
          setFilterModel: jest.fn(),
          applyColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValue([{ colId: '1' } as ColumnState]);
      component['agGridStateService'].getColumnFiltersForCurrentView = jest
        .fn()
        .mockReturnValue([]);

      component.activeTab = QuotationTab.ACTIVE;

      component.onGridReady(mockEvent);

      expect(mockEvent.api.applyColumnState).toHaveBeenCalled();
      expect(mockEvent.api.setFilterModel).toHaveBeenCalled();
    });
  });

  describe('onRowSelected', () => {
    test('should dispatch row selected', () => {
      const overviewCasesFacadeMock: OverviewCasesFacade = {
        selectedIds$: of([1234]),
        selectCase: jest.fn(),
      } as unknown as OverviewCasesFacade;
      Object.defineProperty(component, 'overviewCasesFacade', {
        value: overviewCasesFacadeMock,
      });

      component.onRowSelected({
        node: { isSelected: () => true, data: { gqId: 1234 } },
      } as any);

      expect(component['overviewCasesFacade'].selectCase).toHaveBeenCalledWith(
        1234
      );
    });

    test('should dispatch row deselected', () => {
      const overviewCasesFacadeMock: OverviewCasesFacade = {
        selectedIds$: of([1234]),
        deselectCase: jest.fn(),
      } as unknown as OverviewCasesFacade;

      Object.defineProperty(component, 'overviewCasesFacade', {
        value: overviewCasesFacadeMock,
      });
      component.onRowSelected({
        node: { isSelected: () => false, data: { gqId: 1234 } },
      } as any);

      expect(
        component['overviewCasesFacade'].deselectCase
      ).toHaveBeenCalledWith(1234);
    });
  });

  describe('onRowDoubleClick', () => {
    test('should navigate on double click', () => {
      const mockEvent = {
        data: {
          gqId: 1234,
          customerIdentifiers: {
            customerId: 'customer-id',
            salesOrg: 'sales-org-id',
          },
          status: QuotationStatus.ACTIVE,
          enabledForApprovalWorkflow: true,
        },
      } as any;

      const determineCaseNavigationPathSpy = jest.spyOn(
        component['columnUtilityService'],
        'determineCaseNavigationPath'
      );
      const navigationPath = [AppRoutePath.ProcessCaseViewPath];
      determineCaseNavigationPathSpy.mockReturnValue(navigationPath);

      component.onRowDoubleClicked(mockEvent);

      expect(router.navigate).toHaveBeenCalledWith(navigationPath, {
        queryParamsHandling: 'merge',
        queryParams: {
          quotation_number: mockEvent.data.gqId,
          customer_number: mockEvent.data.customerIdentifiers.customerId,
          sales_org: mockEvent.data.customerIdentifiers.salesOrg,
        },
      });
      expect(determineCaseNavigationPathSpy).toHaveBeenCalledWith(
        mockEvent.data.status,
        mockEvent.data.enabledForApprovalWorkflow
      );
    });
  });

  describe('getMainMenuItems', () => {
    const params: GetMainMenuItemsParams = {
      defaultItems: ['item1', 'item2'],
    } as GetMainMenuItemsParams;

    test('it should add one more menuItem at the end of that array', () => {
      component.ngOnInit();
      ColumnUtilityService.getResetAllFilteredColumnsMenuItem = jest.fn(
        () => 'item3'
      );

      const result = component.getMainMenuItems(params);

      expect(result.length).toBe(3);
      expect(result[2]).toBe('item3');
      expect(
        ColumnUtilityService.getResetAllFilteredColumnsMenuItem
      ).toHaveBeenCalledWith(params);
    });
  });

  describe('getContextMenuItems', () => {
    let params: GetContextMenuItemsParams = {
      column: { getColId: jest.fn(() => 'anyColId') },
      defaultItems: ['item1', 'item2'],
    } as unknown as GetContextMenuItemsParams;

    beforeEach(() => {
      component['columnUtilityService'].getCopyCellContentContextMenuItem =
        jest.fn(() => 'item3');
      ColumnUtilityService.getOpenInNewTabContextMenuItem = jest.fn(
        () => 'tab'
      );
      ColumnUtilityService.getOpenInNewWindowContextMenuItem = jest.fn(
        () => 'window'
      );
    });

    test('should add item to context menu', () => {
      component.ngOnInit();

      const result = component.getContextMenuItems(params);
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe('item3');
    });

    test('should NOT add hyperlink context MenuItems', () => {
      component.getContextMenuItems(params);
      expect(
        ColumnUtilityService.getOpenInNewTabContextMenuItem
      ).not.toHaveBeenCalled();
      expect(
        ColumnUtilityService.getOpenInNewWindowContextMenuItem
      ).not.toHaveBeenCalled();
    });

    test('should request hyperlink contextMenuItems', () => {
      params = {
        ...params,
        column: {
          getColId: jest.fn(() => CaseTableColumnFields.GQ_ID),
        },
      } as unknown as GetContextMenuItemsParams;

      const result = component.getContextMenuItems(params);
      expect(
        ColumnUtilityService.getOpenInNewTabContextMenuItem
      ).toHaveBeenCalled();
      expect(
        ColumnUtilityService.getOpenInNewWindowContextMenuItem
      ).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.length).toBe(3);

      expect(result[0]).toBe('item3');
      expect(result[1]).toBe('tab');
      expect(result[2]).toBe('window');
    });
  });
});
