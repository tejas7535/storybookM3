import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { of } from 'rxjs';

import { AG_GRID_LOCALE_DE } from '@gq/shared/ag-grid/constants/locale-de';
import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import {
  FilterChangedEvent,
  FilterState,
  GetContextMenuItemsParams,
  GridReadyEvent,
} from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculatorTab } from '../../models/calculator-tab.enum';
import { RFQ_4_REQUESTS_TABLE_CUSTOM_VIEWS_CONFIG } from './configs/custom-request-views.config';
import { Rfq4RequestsColDefService } from './configs/rfq-4-request-col-def-service';
import { Rfq4RequestsFields } from './configs/rfq-4-requests-fields.enum';
import { Rfq4RequestsTableComponent } from './rfq-4-requests-table.component';

describe('Rfq4RequestsTableComponent', () => {
  let component: Rfq4RequestsTableComponent;
  let spectator: Spectator<Rfq4RequestsTableComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: Rfq4RequestsTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      provideRouter([]),
      MockProvider(Rfq4RequestsColDefService, {
        COLUMN_DEFS: [],
      }),
      MockProvider(AgGridStateService),
      MockProvider(LocalizationService, {
        locale$: of(AG_GRID_LOCALE_DE),
      }),
      MockProvider(ColumnUtilityService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Observables/signals', () => {
    test(
      'should provide localeText$',
      marbles((m) => {
        m.expect(component.localeText$).toBeObservable(
          m.cold('(a|)', { a: AG_GRID_LOCALE_DE })
        );
      })
    );
    test('should set activeView when activeTab Signal changes', () => {
      component['agGridStateService'].setActiveView = jest.fn();
      spectator.setInput('activeTab', CalculatorTab.DONE);
      expect(
        component['agGridStateService'].setActiveView
      ).toHaveBeenCalledWith(2);
    });
  });

  describe('methods', () => {
    describe('ngOnInit', () => {
      test('should set columnDefs', () => {
        spectator.setInput('activeTab', CalculatorTab.OPEN);
        component['columnDefService'].getColDefsForOpenTab = jest.fn();
        component.ngOnInit();
        expect(
          component['columnDefService'].getColDefsForOpenTab
        ).toHaveBeenCalled();
      });
      test('should call ini of aggridStateService', () => {
        component['agGridStateService'].init = jest.fn();
        component.ngOnInit();
        expect(component['agGridStateService'].init).toHaveBeenCalledWith(
          component.TABLE_KEY,
          RFQ_4_REQUESTS_TABLE_CUSTOM_VIEWS_CONFIG
        );
      });
    });

    describe('onGridReady', () => {
      test('should call setFilterModel', () => {
        const event = {
          api: {
            setFilterModel: jest.fn(),
          },
        } as unknown as GridReadyEvent;
        component['agGridStateService'].getColumnFiltersForCurrentView = jest
          .fn()
          .mockReturnValue([{ actionItemId: 'DONE' } as FilterState]);
        component.onGridReady(event);
        expect(event.api.setFilterModel).toHaveBeenCalled();
        expect(
          component['agGridStateService'].getColumnFiltersForCurrentView
        ).toHaveBeenCalled();
      });
    });

    describe('onFilterChanged', () => {
      test('should call setColumnFilterForCurrentView', () => {
        const event = {
          api: {
            getFilterModel: jest.fn(),
          },
        } as unknown as FilterChangedEvent;
        component['agGridStateService'].setColumnFilterForCurrentView = jest
          .fn()
          .mockReturnValue({} as FilterState);
        component.onFilterChanged(event);
        expect(
          component['agGridStateService'].setColumnFilterForCurrentView
        ).toHaveBeenCalled();
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

      test('should not add hyperlink context MenuItems', () => {
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
            getColId: jest.fn(() => Rfq4RequestsFields.RFQ_ID),
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
});
