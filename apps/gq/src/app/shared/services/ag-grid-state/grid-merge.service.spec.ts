import { CustomView, GridState } from '@gq/shared/models/grid-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ColumnState } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GridMergeService } from './grid-merge.service';

describe('GridMergeService', () => {
  let spectator: SpectatorService<GridMergeService>;
  let service: GridMergeService;

  const createService = createServiceFactory({
    service: GridMergeService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  test('shall create', () => {
    expect(service).toBeTruthy();
  });

  describe('handleAdjustments', () => {
    test('shall call handleColumnsFromLocalStorage and handleColumnsFromUserGrid', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2'],
        customViews: [],
      } as GridState;
      const columnIds = ['col1', 'col2', 'col3'];
      service['checkForAdjustmentsNeeded'] = jest.fn().mockReturnValue(true);
      service['handleColumnsFromLocalStorage'] = jest.fn();
      service['handleColumnsFromUserGrid'] = jest.fn();
      service.handleAdjustments(gridState, null, columnIds, null);

      expect(service['handleColumnsFromLocalStorage']).toHaveBeenCalled();
      expect(service['handleColumnsFromUserGrid']).toHaveBeenCalled();
    });

    test('shall not call handleColumnsFromLocalStorage and handleColumnsFromUserGrid', () => {
      service['checkForAdjustmentsNeeded'] = jest.fn().mockReturnValue(false);
      service['handleColumnsFromLocalStorage'] = jest.fn();
      service['handleColumnsFromUserGrid'] = jest.fn();
      service.handleAdjustments(null, null, null, null);

      expect(service['handleColumnsFromLocalStorage']).not.toHaveBeenCalled();
      expect(service['handleColumnsFromUserGrid']).not.toHaveBeenCalled();
    });
  });

  describe('getUpdateCustomViewsWhenConfiguredColumnsRemoved', () => {
    test('shall return true', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2'],
        customViews: [],
      } as GridState;
      const columnIds = ['col1'];
      const result = service.getUpdateCustomViewsWhenConfiguredColumnsRemoved(
        gridState,
        null,
        columnIds
      );

      expect(result).toBe(true);
    });

    test('shall return false', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2'],
        customViews: [],
      } as GridState;
      const columnIds = ['col1', 'col2'];
      const result = service.getUpdateCustomViewsWhenConfiguredColumnsRemoved(
        gridState,
        null,
        columnIds
      );

      expect(result).toBe(false);
    });
  });
  describe('checkForAdjustmentsNeeded', () => {
    test('shall return true', () => {
      service['getColumnsInLocalStorageButNotInUserGrid'] = jest
        .fn()
        .mockReturnValue(['col3']);
      service['getColumnsInUserGridButNotInLocalStorage'] = jest
        .fn()
        .mockReturnValue(['col4']);
      const result = service['checkForAdjustmentsNeeded'](
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
      expect(result).toBe(true);
    });
    test('shall return false', () => {
      service['getColumnsInLocalStorageButNotInUserGrid'] = jest
        .fn()
        .mockReturnValue([]);
      service['getColumnsInUserGridButNotInLocalStorage'] = jest
        .fn()
        .mockReturnValue([]);
      const result = service['checkForAdjustmentsNeeded'](
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
      expect(result).toBe(false);
    });
  });

  describe('handleColumnsFromLocalStorage', () => {
    test('should call methods', () => {
      service['getColumnsInLocalStorageButNotInUserGrid'] = jest
        .fn()
        .mockReturnValue(() => {});
      service['addLocalStorageColumnToUserGridAtIndex'] = jest
        .fn()
        .mockReturnValue(() => {});

      service['handleColumnsFromLocalStorage'](
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
      expect(
        service['getColumnsInLocalStorageButNotInUserGrid']
      ).toHaveBeenCalled();
      expect(
        service['addLocalStorageColumnToUserGridAtIndex']
      ).toHaveBeenCalled();
    });
  });

  describe('handleColumnsFromUserGrid', () => {
    test('should call methods', () => {
      service['getColumnsInUserGridButNotInLocalStorage'] = jest
        .fn()
        .mockReturnValue(() => {});
      service['moveColumnNotInLocalStorageToIndexConfigured'] = jest
        .fn()
        .mockReturnValue(() => {});

      service['handleColumnsFromUserGrid'](
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
      expect(
        service['getColumnsInUserGridButNotInLocalStorage']
      ).toHaveBeenCalled();
      expect(
        service['moveColumnNotInLocalStorageToIndexConfigured']
      ).toHaveBeenCalled();
    });
  });

  describe('moveColumnNotInLocalStorageToIndexConfigured', () => {
    test('shall move col2 to the correct index within the localStorage', () => {
      const columnIds = ['col1', 'col2', 'col3'];
      const columnStatesInGridButNotInLocalStorage = [
        { colId: 'col2' } as ColumnState,
      ];
      const activeViewId = 1;
      const gridStateIn: GridState = {
        initialColIds: columnIds,
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [
                { colId: 'col1' },
                { colId: 'col3' },
                { colId: 'col2' },
              ],
            },
          },
        ],
      } as GridState;
      const gridStateOut: GridState = {
        initialColIds: columnIds,
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [
                { colId: 'col1' },
                { colId: 'col2' },
                { colId: 'col3' },
              ],
            },
          },
        ],
      } as GridState;

      service['moveColumnNotInLocalStorageToIndexConfigured'](
        columnStatesInGridButNotInLocalStorage,
        gridStateIn,
        activeViewId,
        columnIds
      );

      expect(gridStateIn).toEqual(gridStateOut);
    });
  });

  describe('addLocalStorageColumnToUserGridAtIndex', () => {
    test('shall add col2 to the correct index in the AppGrid from the localStorage', () => {
      const currentViewLocalStorage: CustomView = {
        id: 1,
        title: 'test',
        state: {
          columnState: [
            { colId: 'col1' },
            { colId: 'col2' },
            { colId: 'col3' },
          ],
        },
      } as CustomView;

      const columnStatesInLocalStorageButNotInViewInApp = [
        { colId: 'col2' } as ColumnState,
      ];
      const activeViewId = 1;
      const gridStateIn: GridState = {
        initialColIds: [],
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [{ colId: 'col1' }, { colId: 'col3' }],
            },
          },
        ],
      } as GridState;
      const gridStateOut: GridState = {
        initialColIds: [],
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [
                { colId: 'col1' },
                { colId: 'col2' },
                { colId: 'col3' },
              ],
            },
          },
        ],
      } as GridState;

      service['addLocalStorageColumnToUserGridAtIndex'](
        columnStatesInLocalStorageButNotInViewInApp,
        gridStateIn,
        activeViewId,
        currentViewLocalStorage
      );

      expect(gridStateIn).toEqual(gridStateOut);
    });
  });
  describe('getColumnsInUserGridButNotInLocalStorage', () => {
    test('shall return col2', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2', 'col3'],
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [
                { colId: 'col1' },
                { colId: 'col2' },
                { colId: 'col3' },
              ],
            },
          },
        ],
      } as GridState;
      const currentViewLocalStorage: CustomView = {
        id: 1,
        title: 'test',
        state: {
          columnState: [{ colId: 'col1' }, { colId: 'col3' }],
        },
      } as CustomView;

      const result = service['getColumnsInUserGridButNotInLocalStorage'](
        gridState,
        1,
        currentViewLocalStorage
      );
      expect(result).toEqual([{ colId: 'col2' }]);
    });
    test('shall return empty array', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2', 'col3'],
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [
                { colId: 'col1' },
                { colId: 'col2' },
                { colId: 'col3' },
              ],
            },
          },
        ],
      } as GridState;
      const currentViewLocalStorage: CustomView = {
        id: 1,
        title: 'test',
        state: {
          columnState: [
            { colId: 'col1' },
            { colId: 'col2' },
            { colId: 'col3' },
          ],
        },
      } as CustomView;

      const result = service['getColumnsInUserGridButNotInLocalStorage'](
        gridState,
        1,
        currentViewLocalStorage
      );
      expect(result).toEqual([]);
    });
  });

  describe('getColumnsInLocalStorageButNotInUserGrid', () => {
    test('shall return col2', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2', 'col3'],
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [{ colId: 'col1' }, { colId: 'col3' }],
            },
          },
        ],
      } as GridState;
      const currentViewLocalStorage: CustomView = {
        id: 1,
        title: 'test',
        state: {
          columnState: [
            { colId: 'col1' },
            { colId: 'col2' },
            { colId: 'col3' },
          ],
        },
      } as CustomView;

      const result = service['getColumnsInLocalStorageButNotInUserGrid'](
        gridState,
        1,
        currentViewLocalStorage
      );
      expect(result).toEqual([{ colId: 'col2' }]);
    });
    test('shall return empty array', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2', 'col3'],
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [
                { colId: 'col1' },
                { colId: 'col2' },
                { colId: 'col3' },
              ],
            },
          },
        ],
      } as GridState;
      const currentViewLocalStorage: CustomView = {
        id: 1,
        title: 'test',
        state: {
          columnState: [
            { colId: 'col1' },
            { colId: 'col2' },
            { colId: 'col3' },
          ],
        },
      } as CustomView;

      const result = service['getColumnsInLocalStorageButNotInUserGrid'](
        gridState,
        1,
        currentViewLocalStorage
      );
      expect(result).toEqual([]);
    });
  });

  describe('getCustomViewOfActiveView', () => {
    test('shall return the CustomView of gridStatesActiveView', () => {
      const gridState: GridState = {
        initialColIds: [],
        customViews: [
          {
            id: 0,
            title: 'default',
            state: {
              columnState: [],
              filterState: [],
            },
          },
          {
            id: 1,
            title: 'test',
            state: {
              columnState: [{ colId: 'col1' }, { colId: 'col3' }],
            },
          },
        ],
      } as GridState;
      const result = service['getCustomViewOfActiveView'](gridState, 1);
      expect(result).toEqual(gridState.customViews[1]);
    });
  });
});
