import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { CaseTableColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import {
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  RowNode,
} from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  VIEW_CASE_STATE_MOCK,
} from '../../../testing/mocks';
import { AppRoutePath } from '../../app-route-path.enum';
import { CaseTableComponent } from './case-table.component';
import { ColumnDefService } from './config/column-def.service';

describe('CaseTableComponent', () => {
  let component: CaseTableComponent;
  let spectator: Spectator<CaseTableComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: CaseTableComponent,
    imports: [
      RouterTestingModule.withRoutes([]),
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
    ],
    providers: [
      MockProvider(ColumnDefService, {
        COLUMN_DEFS: [],
      }),
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

  describe('on init', () => {
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
        },
      } as any;

      component.selectedRows = [1234];
      component.onGridReady(mockEvent);

      expect(nodes[0].setSelected).toHaveBeenCalledWith(true);
      expect(nodes[1].setSelected).not.toHaveBeenCalled();
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
        },
      } as any;
      component.onRowDoubleClicked(mockEvent);

      expect(router.navigate).toHaveBeenCalledWith(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: mockEvent.data.gqId,
            customer_number: mockEvent.data.customerIdentifiers.customerId,
            sales_org: mockEvent.data.customerIdentifiers.salesOrg,
          },
        }
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
      ColumnUtilityService.getCopyCellContentContextMenuItem = jest.fn(
        () => 'item3'
      );
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
