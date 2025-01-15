import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ColumnUtilityService } from '@gq/shared/ag-grid/services';
import { UserRoles } from '@gq/shared/constants';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FilterChangedEvent } from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ComparableTransactionsComponent } from './comparable-transactions.component';
import { ColumnDefService } from './config';

describe('ComparableTransactionsComponent', () => {
  let component: ComparableTransactionsComponent;
  let spectator: Spectator<ComparableTransactionsComponent>;
  let store: MockStore;
  let columnDefService: ColumnDefService;

  const createComponent = createComponentFactory({
    component: ComparableTransactionsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      ColumnDefService,
      {
        provide: ColumnUtilityService,
        useValue: {},
      },
      provideMockStore(),
      MockProvider(ApplicationInsightsService),
      MockProvider(TranslocoLocaleService),
      MockProvider(AgGridStateService),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    columnDefService = spectator.inject(ColumnDefService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('currency input', () => {
    test('should set tableContext', () => {
      const currency = 'USD';
      component.currency = currency;

      expect(component.tableContext.quotation.currency).toEqual(currency);
    });
  });
  describe('columnChange', () => {
    test('should set column state', () => {
      const event = {
        api: {
          getColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('onGridReady', () => {
    test('should set columnState', () => {
      const event = {
        api: {
          applyColumnState: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValue('state');
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
      expect(event.api.applyColumnState).toHaveBeenCalledTimes(1);
    });
    test('should not set columnState', () => {
      const event = {
        api: {
          applyColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnStateForCurrentView = jest.fn();
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
      expect(event.api.applyColumnState).toHaveBeenCalledTimes(0);
    });
  });
  describe('onFirstDataRendered', () => {
    test('should autoSize customerId with skipHeader', () => {
      const id = 'customerId';
      const element = {
        getColId: jest.fn(() => id),
      };
      const params = {
        api: {
          autoSizeColumns: jest.fn(),
          getColumns: jest.fn(() => [element]),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.api.autoSizeColumns).toHaveBeenCalledTimes(1);
      expect(params.api.autoSizeColumns).toBeCalledWith([id], true);
    });
    test('should autoSize without skipHeader', () => {
      const id = 'any';
      const element = {
        getColId: jest.fn(() => id),
      };
      const params = {
        api: {
          autoSizeColumns: jest.fn(),
          getColumns: jest.fn(() => [element]),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.api.autoSizeColumns).toHaveBeenCalledTimes(1);
      expect(params.api.autoSizeColumns).toBeCalledWith([id], false);
    });
  });

  describe('onFilterChanged', () => {
    test('should emit onFilterChangedEvent', () => {
      let result;
      spectator.output('filterChanged').subscribe((res) => (result = res));

      const mockEvent = {
        afterDataChange: false,
        afterFloatingFilter: false,
        columns: [],
        api: {},
      } as FilterChangedEvent;
      component.onFilterChanged(mockEvent);

      expect(result).toEqual(mockEvent);
    });
  });
  describe('column definitions', () => {
    test('should return all columns for user with GPC Role', () => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: [UserRoles.BASIC, UserRoles.COST_GPC],
            },
          },
        },
      });

      spectator.detectChanges();

      let result;
      spectator.component.columnDefs$.subscribe((colDefs) => {
        result = colDefs;
      });

      spectator.detectChanges();

      expect(result).toEqual(columnDefService.COLUMN_DEFS);
    });

    test('should NOT return profitMargin Col for users WITHOUT GPC Role', () => {
      store.setState({
        'azure-auth': {
          accountInfo: {
            idTokenClaims: {
              roles: [UserRoles.BASIC],
            },
          },
        },
      });

      spectator.detectChanges();

      let result;
      spectator.component.columnDefs$.subscribe((colDefs) => {
        result = colDefs;
      });

      spectator.detectChanges();

      expect(result).toEqual(
        columnDefService.COLUMN_DEFS.filter(
          (col) => col.field !== 'profitMargin'
        )
      );
    });
  });
});
