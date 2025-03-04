/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { OpenItemsFacade } from '@gq/core/store/active-case/open-items.facade';
import { PositionIdComponent } from '@gq/shared/ag-grid/cell-renderer/position-id/position-id.component';
import { AG_GRID_LOCALE_DE } from '@gq/shared/ag-grid/constants/locale-de';
import {
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnDefinitionService } from './config/column-definition.service';
import { DEFAULT_COL_DEF } from './config/default-config';
import { OpenItemsTableComponent } from './open-items-table.component';

describe('OpenItemsTableComponent', () => {
  let component: OpenItemsTableComponent;
  let spectator: Spectator<OpenItemsTableComponent>;
  const colDefServiceMock: ColumnDefinitionService = {
    COMPONENTS: { PositionIdComponent },
    DEFAULT_COL_DEF,
    COLUMN_DEFS: [],
    getSqvStatusText: jest.fn(),
  } as unknown as ColumnDefinitionService;

  const createComponent = createComponentFactory({
    component: OpenItemsTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      mockProvider(OpenItemsFacade, {
        openItems$: of([]),
      }),
      mockProvider(LocalizationService, {
        locale$: of(AG_GRID_LOCALE_DE),
      } as unknown),
      {
        provide: ColumnDefinitionService,
        useValue: colDefServiceMock,
      },
      mockProvider(ColumnUtilityService),
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
});
