import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { RfqItemsFacade } from '@gq/core/store/active-case/rfq-items.facade';
import { PositionIdComponent } from '@gq/shared/ag-grid/cell-renderer/position-id/position-id.component';
import { AG_GRID_LOCALE_DE } from '@gq/shared/ag-grid/constants/locale-de';
import {
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { GetContextMenuItemsParams } from 'ag-grid-enterprise';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnDefinitionService } from './config/column-definition.service';
import { DEFAULT_COL_DEF } from './config/default-config';
import { RfqItemsTableComponent } from './rfq-items-table.component';

describe('RfqItemsTableComponent', () => {
  let component: RfqItemsTableComponent;
  let spectator: Spectator<RfqItemsTableComponent>;
  const colDefServiceMock: ColumnDefinitionService = {
    COMPONENTS: { PositionIdComponent },
    DEFAULT_COL_DEF,
    COLUMN_DEFS: [],
    getSqvStatusText: jest.fn(),
  } as unknown as ColumnDefinitionService;

  const createComponent = createComponentFactory({
    component: RfqItemsTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      mockProvider(RfqItemsFacade, {
        rfqItems$: of([]),
      }),
      mockProvider(LocalizationService, {
        locale$: of(AG_GRID_LOCALE_DE),
      } as unknown),
      {
        provide: ColumnDefinitionService,
        useValue: colDefServiceMock,
      },
      mockProvider(ColumnUtilityService),
      mockProvider(AgGridStateService),
    ],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Observables', () => {
    test(
      'should provide localeText$',
      marbles((m) => {
        m.expect(component.localeText$).toBeObservable(
          m.cold('(a|)', { a: AG_GRID_LOCALE_DE })
        );
      })
    );

    test(
      'should provide rowData$',
      marbles((m) => {
        m.expect(component.rowData$).toBeObservable(m.cold('(a|)', { a: [] }));
      })
    );
  });

  describe('methods', () => {
    const params: GetContextMenuItemsParams = {
      column: { getColId: jest.fn(() => 'anyColId') },
      defaultItems: ['item1', 'item2'],
    } as unknown as GetContextMenuItemsParams;

    beforeEach(() => {
      component['columnUtilityService'].getCopyCellContentContextMenuItem =
        jest.fn(() => 'item3');
    });
    test('should add item to context menu', () => {
      const result = component.getContextMenuItems(params);
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe('item3');
    });
  });
});
