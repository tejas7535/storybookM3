import { QuotationDetail } from '@gq/shared/models';
import {
  CustomView,
  FilterState,
  GridState,
} from '@gq/shared/models/grid-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ColumnState } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { ViewToggle } from '@schaeffler/view-toggle';

import { AgGridStateService } from './ag-grid-state.service';

const translatedViewName = 'translate it';

const mockState = {
  version: 1,
  customViews: [
    { id: 0, title: translatedViewName, state: { columnState: [] } },
    {
      id: 3,
      title: 'test view 1',
      state: { columnState: [{ colId: 'anything' }] },
    },
    {
      id: 1,
      title: 'test view 2',
      state: { columnState: [] },
    },
    { id: 2, title: 'test view 3', state: { columnState: [] } },
  ],
} as GridState;

describe('AgGridStateService', () => {
  let spectator: SpectatorService<AgGridStateService>;
  let service: AgGridStateService;

  const createService = createServiceFactory({
    service: AgGridStateService,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(AgGridStateService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    beforeEach(() => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(null);
    });
    test('should save to local storage if key does not already exist', () => {
      service['gridLocalStorageService'].createInitialLocalStorage = jest
        .fn()
        .mockReturnValue('');

      service.getCustomViews = jest.fn();
      const expectedKey = 'GQ_PROCESS_CASE_STATE';

      service.init('process_case');

      expect(
        service['gridLocalStorageService'].createInitialLocalStorage
      ).toHaveBeenCalledTimes(1);
      expect(
        service['gridLocalStorageService'].createInitialLocalStorage
      ).toHaveBeenCalledWith(expectedKey, undefined, undefined);
    });
    test('should NOT save to local storage if key already exists', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue('{}');
      service['gridLocalStorageService'].createInitialLocalStorage = jest.fn();
      service.init('process_case');

      expect(
        service['gridLocalStorageService'].createInitialLocalStorage
      ).not.toHaveBeenCalled();
    });

    test('should include additional if preset', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue('');
      service['gridLocalStorageService'].createInitialLocalStorage = jest.fn();
      service.getCustomViews = jest.fn();

      service.init('process_case', [
        {
          id: 1,
          title: 'test view 1',
          state: { columnState: [], filterState: [] },
        },
      ]);

      expect(
        service['gridLocalStorageService'].createInitialLocalStorage
      ).toHaveBeenCalledWith(
        'GQ_PROCESS_CASE_STATE',
        [
          {
            id: 1,
            title: 'test view 1',
            state: { columnState: [], filterState: [] },
          },
        ],
        undefined
      );
    });

    test('should add initialColumns field when Key is present and ColumnId are given', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service.getCustomViews = jest.fn();

      service.init('process_case', null, ['col1', 'col2']);
      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        initialColIds: ['col1', 'col2'],
      });
    });

    test('should update initialColIds when empty Array has been saved in LocalStorage', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue({
          version: 1,
          customViews: [
            {
              id: 0,
              title: translatedViewName,
              state: { columnState: [] },
            },
          ],
          initialColIds: [],
        });
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service.getCustomViews = jest.fn();

      service.init('process_case', null, ['col1', 'col2']);

      expect(service['saveGridState']).toHaveBeenCalledWith({
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: { columnState: [] },
          },
        ],
        initialColIds: ['col1', 'col2'],
      });
    });

    test('not include initialColIds when not given', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(null);
      service['gridLocalStorageService'].createInitialLocalStorage = jest
        .fn()
        .mockImplementation(() => {});
      service.getCustomViews = jest.fn();

      service.init('process_case');

      expect(
        service['gridLocalStorageService'].createInitialLocalStorage
      ).toHaveBeenCalledWith('GQ_PROCESS_CASE_STATE', undefined, undefined);
    });
    test('should call cleanupRemovedColumns', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue({
          version: 1,
          customViews: [
            {
              id: 0,
              title: translatedViewName,
              state: { columnState: [] },
            },
          ],
          initialColIds: ['col1', 'col2'],
        });
      service.getCustomViews = jest.fn();
      service['cleanupRemovedColumns'] = jest.fn();

      service.init('process_case', null, ['col1']);

      expect(service['cleanupRemovedColumns']).toHaveBeenCalledTimes(1);
    });
  });

  describe('containSameColIds', () => {
    test('should return true if both states contain the same col ids', () => {
      const oldState = [
        { colId: 'a' },
        { colId: 'b' },
        { colId: 'e' },
        { colId: 'f' },
        { colId: 'h' },
        { colId: 'i' },
      ];
      const newState = [
        { colId: 'a' },
        { colId: 'b' },
        { colId: 'i' },
        { colId: 'f' },
        { colId: 'e' },
        { colId: 'h' },
      ];

      const result = service['containSameColIds'](oldState, newState);

      expect(result).toBeTruthy();
    });

    test('should return false if states differ', () => {
      const oldState = [
        { colId: 'a' },
        { colId: 'b' },
        { colId: 'e' },
        { colId: 'f' },
        { colId: 'x' },
        { colId: 'i' },
      ];
      const newState = [
        { colId: 'a' },
        { colId: 'b' },
        { colId: 'i' },
        { colId: 'f' },
        { colId: 'e' },
        { colId: 'h' },
      ];

      const result = service['containSameColIds'](oldState, newState);

      expect(result).toBeFalsy();
    });
  });

  describe('getColumnState', () => {
    test('should return empty array if view not found', () => {
      service['gridLocalStorageService'].getViewById = jest.fn(() => null);

      const result = service['getColumnState']('key', 2);

      expect(result).toEqual([]);
      expect(
        service['gridLocalStorageService'].getViewById
      ).toHaveBeenCalledWith('key', 2);
    });

    test('should return empty array if state undefined', () => {
      service['gridLocalStorageService'].getViewById = jest.fn(
        () => ({}) as unknown as CustomView
      );

      const result = service['getColumnState']('key', 2);

      expect(result).toEqual([]);
      expect(
        service['gridLocalStorageService'].getViewById
      ).toHaveBeenCalledWith('key', 2);
    });

    test('should return empty array if columnState undefined', () => {
      service['gridLocalStorageService'].getViewById = jest.fn(
        () => ({ state: {} }) as unknown as CustomView
      );

      const result = service['getColumnState']('key', 2);

      expect(result).toEqual([]);
      expect(
        service['gridLocalStorageService'].getViewById
      ).toHaveBeenCalledWith('key', 2);
    });

    test('should return state', () => {
      service['gridLocalStorageService'].getViewById = jest.fn(
        () => ({ state: { columnState: ['ab'] } }) as unknown as CustomView
      );

      const result = service['getColumnState']('key', 2);

      expect(result).toEqual(['ab']);
      expect(
        service['gridLocalStorageService'].getViewById
      ).toHaveBeenCalledWith('key', 2);
    });
  });

  describe('getColumnData', () => {
    test('should call method and return value', () => {
      service['localStorageService'].getFromLocalStorage = jest
        .fn()
        .mockReturnValue([{ gqPositionId: 10 } as unknown as QuotationDetail]);
      const result = service.getColumnData('1234');
      expect(result).toEqual([{ gqPositionId: 10 }]);
    });
  });
  describe('setColumnData', () => {
    test('should call localStorageService', () => {
      service['localStorageService'].setToLocalStorage = jest.fn();
      service.setColumnData('1234', [
        { gqPositionId: '10' } as unknown as QuotationDetail,
      ]);
      expect(
        service['localStorageService'].setToLocalStorage
      ).toHaveBeenCalledWith('1234_items', [{ gqPositionId: '10' }]);
    });
  });
  describe('getColumnFiltersForCurrentView', () => {
    test('should return the filterState of the current view', () => {
      service['getColumnFilters'] = jest.fn();
      service.getColumnFiltersForCurrentView();
      expect(service['getColumnFilters']).toHaveBeenCalled();
    });
  });

  describe('setColumnFilterForCurrentView', () => {
    test('should call method with correct parameters', () => {
      service['setColumnFilters'] = jest.fn();
      service['activeViewId$$'].next(1);
      service['activeTableKey'] = 'test';

      service.setColumnFilterForCurrentView('actionItemId', { test: 'test2' });
      expect(service['setColumnFilters']).toHaveBeenCalledWith(
        'test',
        1,
        'actionItemId',
        { test: 'test2' }
      );
    });
  });
  describe('getColumnStateForCurrentView', () => {
    test('should call method with correct parameters', () => {
      service['getColumnState'] = jest.fn();
      service['activeViewId$$'].next(1);
      service['activeTableKey'] = 'test';
      service.getColumnStateForCurrentView();
      expect(service['getColumnState']).toHaveBeenCalledWith('test', 1);
    });
  });

  describe('setColumnStateForCurrentView', () => {
    test('should call method with correct parameters', () => {
      const columnState: ColumnState[] = [{ colId: 'test', hide: true }];
      service['setColumnState'] = jest.fn();
      service['activeViewId$$'].next(1);
      service['activeTableKey'] = 'test';
      service.setColumnStateForCurrentView(columnState);
      expect(service['setColumnState']).toHaveBeenCalledWith(
        'test',
        1,
        columnState
      );
    });
  });

  describe('setActiveView', () => {
    test('should set activeViewId and call other methods', () => {
      service['activeViewId$$'].next(0);
      service['updateViews'] = jest.fn();
      service.setActiveView(1);
      expect(service['activeViewId$$'].value).toBe(1);
      expect(service['updateViews']).toHaveBeenCalled();
    });
  });

  describe('getCustomViews', () => {
    test('should return customViews', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      const result = service.getCustomViews();
      expect(result).toEqual(
        mockState.customViews.map((view) => ({
          id: view.id,
          active: false,
          title: view.title,
        }))
      );
    });
  });
  describe('getCurrentViewId', () => {
    test('should return activeViewId', () => {
      service['activeViewId$$'].next(1);
      const result = service.getCurrentViewId();
      expect(result).toBe(1);
    });
  });

  describe('createViewFromCurrentView', () => {
    test('should create a new view from the current view', () => {
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue({
          state: {
            columnState: [],
          },
        } as unknown as CustomView);
      service['createNewView'] = jest.fn().mockImplementation(() => {});
      service.createViewFromCurrentView('title', 'actionItemId');
      expect(service['createNewView']).toHaveBeenCalledWith(
        'title',
        expect.anything(),
        'actionItemId'
      );
    });
  });

  describe('deleteView', () => {
    test('should delete the view', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service.deleteView(2);
      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        customViews: mockState.customViews.filter((view) => view.id !== 2),
      });
    });
  });

  describe('getViewNameById', () => {
    test('should return the name of the view', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      const result = service.getViewNameById(1);
      expect(result).toBe(
        mockState.customViews.find((view) => view.id === 1).title
      );
    });
  });

  describe('updateViewName', () => {
    test('should update the name of the view', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service.updateViewName(1, 'new name');
      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        customViews: mockState.customViews.map((view) =>
          view.id === 1 ? { ...view, title: 'new name' } : view
        ),
      });
    });
  });

  describe('resetFilterModelsOfDefaultView', () => {
    test('should call method with correct parameters', () => {
      service['setColumnFilters'] = jest.fn();
      service['activeTableKey'] = 'key';
      service['DEFAULT_VIEW_ID'] = 0;
      service.resetFilterModelsOfDefaultView('actionItemId');
      expect(service['setColumnFilters']).toHaveBeenCalledWith(
        'key',
        0,
        'actionItemId',
        {}
      );
    });
  });

  describe('renameQuotationIdToActionItemForProcessCaseState', () => {
    test('should call method', () => {
      service[
        'gridLocalStorageService'
      ].renameQuotationIdToActionItemForProcessCaseState = jest.fn();
      service.renameQuotationIdToActionItemForProcessCaseState();

      expect(
        service['gridLocalStorageService']
          .renameQuotationIdToActionItemForProcessCaseState
      ).toHaveBeenCalled();
    });
  });

  describe('clearDefaultViewColumnAndFilterState', () => {
    test('should clear ColumnState and FilterState of the default view', () => {
      const state: GridState = {
        customViews: [
          {
            id: 0,
            title: 'text',
            state: {
              columnState: [{ colId: 'test', hide: true }],
              filterState: [
                {
                  actionItemId: 'id',
                },
              ],
            },
          } as CustomView,
        ],
      } as unknown as GridState;

      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(state);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service.clearDefaultViewColumnAndFilterState();
      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...state,
        customViews: [
          {
            id: 0,
            title: 'text',
            state: {
              columnState: [],
              filterState: [],
            },
          },
        ],
      });
    });
  });

  // private methods

  describe('setColumnState', () => {
    test('should set columnState', () => {
      const columnState: ColumnState[] = [{ colId: 'test', hide: true }];
      const viewId = 1;
      const tableKey = 'test';
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      const expectedstate = {
        ...mockState,
        customViews: mockState.customViews.map((view) =>
          view.id === viewId ? { ...view, state: { columnState } } : view
        ),
      };

      service['setColumnState'](tableKey, viewId, columnState);

      expect(service['saveGridState']).toHaveBeenCalledWith(expectedstate);
    });
  });

  describe('createNewView', () => {
    test('should create a new view when actionItemId is not set', () => {
      const columnState: ColumnState[] = [{ colId: 'test', hide: true }];
      const filterState: FilterState[] = [];
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service['updateViews'] = jest.fn();
      service['getColumnFilters'] = jest
        .fn()
        .mockImplementation(() => filterState);
      service['generateViewId'] = jest.fn().mockImplementation(() => 12);
      service['createNewView']('title', columnState);
      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        customViews: [
          ...mockState.customViews,
          {
            id: 12,
            title: 'title',
            state: { columnState, filterState },
          },
        ],
      });
      expect(service['updateViews']).toHaveBeenCalled();
      expect(service['getColumnFilters']).toHaveBeenCalled();
    });
  });

  describe('generateViewId', () => {
    test('generate an id that is not already in use', () => {
      service.getCustomViews = jest
        .fn()
        .mockReturnValue([{ id: 0 }, { id: 1 }, { id: 2 }]);
      const result = service['generateViewId']();
      expect(result).toBe(3);
    });
  });

  describe('SaveGridState', () => {
    beforeEach(() => {
      service['gridLocalStorageService'].setGridState = jest
        .fn()
        .mockImplementation(() => {});
      service['gridMergeService'].mergeAndReorderColumns = jest.fn();

      service['updateViews'] = jest.fn();
      service['activeTableKey'] = 'key';

      service['activeViewId$$'].next(3); // Not default

      service['columnIds'] = ['colId1', 'colId2'];
    });
    test('should save the State and call update methods', () => {
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue({ state: { columnState: [] } });

      service['saveGridState'](mockState);

      expect(
        service['gridMergeService'].mergeAndReorderColumns
      ).not.toHaveBeenCalled();
      expect(service['updateViews']).toHaveBeenCalled();
      expect(
        service['gridLocalStorageService'].setGridState
      ).toHaveBeenCalledWith('key', mockState);
    });

    test('should call handleAdjustments if there are differences', () => {
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue({
          state: { columnState: [{ colId: 'oldCol' }] },
        });
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue({
          customViews: [
            { id: 3, state: { columnState: [{ colId: 'newCol' }] } },
          ],
          initialColIds: ['colId1', 'colId2'],
        });

      service['containSameColIds'] = jest.fn().mockReturnValue(false);

      service['saveGridState'](mockState);

      expect(
        service['gridMergeService'].mergeAndReorderColumns
      ).toHaveBeenCalled();
      expect(service['updateViews']).toHaveBeenCalled();
      expect(
        service['gridLocalStorageService'].setGridState
      ).toHaveBeenCalledWith('key', mockState);
    });
  });

  describe('updateViews', () => {
    test('should update the views when views are present', () => {
      service['getCustomViews'] = jest
        .fn()
        .mockReturnValue([
          { active: false, id: 0 } as ViewToggle,
          { active: false, id: 1 } as ViewToggle,
        ]);
      service['activeViewId$$'].next(1);

      service['updateViews']();
      expect(service['views$$'].value).toEqual([
        { active: false, id: 0 } as ViewToggle,
        { active: true, id: 1 } as ViewToggle,
      ]);
    });
    test('should return empty array when no views are present', () => {
      service['getCustomViews'] = jest.fn().mockReturnValue([]);
      service['activeViewId$$'].next(1);

      service['updateViews']();
      expect(service['views$$'].value).toEqual([]);
    });
  });

  describe('setColumnFilters', () => {
    test('should save the new FilterModel to the FilterState in LocalStorage, no existing in localStorage', () => {
      const actionItemId = 'actionItemId';
      const filterModels: { [key: string]: string } = { test: 'test' };
      service['getColumnFilters'] = jest.fn().mockReturnValue([]);
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});

      service['setColumnFilters']('key', 1, actionItemId, filterModels);

      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        customViews: mockState.customViews.map((view) =>
          view.id === 1
            ? {
                ...view,
                state: {
                  columnState: [],
                  filterState: [{ actionItemId, filterModels }],
                },
              }
            : view
        ),
      });
    });

    test('should update the localStorage with the new filterModel', () => {
      const actionItemId = 'actionItemId';
      const filterModels: { [key: string]: string } = { test: 'test' };
      const localStorageFilterState = {
        actionItemId,
        filterModels: {
          'material.materialNumber15': { values: [], filterType: 'set' },
        } as any,
      };
      service['getColumnFilters'] = jest
        .fn()
        .mockReturnValue([localStorageFilterState]);

      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});

      service['setColumnFilters']('key', 1, actionItemId, filterModels);

      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        customViews: mockState.customViews.map((view) =>
          view.id === 1
            ? {
                ...view,
                state: {
                  columnState: [],
                  filterState: [{ actionItemId, filterModels }],
                },
              }
            : view
        ),
      });
    });

    test('should add a new FilterModel because of a new ActionItemId', () => {
      const actionItemId = 'actionItemId';
      const filterModels: { [key: string]: string } = { test: 'test' };
      const localStorageFilterState = {
        actionItemId: 'existingActionItemId',
        filterModels: {
          'material.materialNumber15': { values: [], filterType: 'set' },
        } as any,
      };
      service['getColumnFilters'] = jest
        .fn()
        .mockReturnValue([localStorageFilterState]);

      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});

      service['setColumnFilters']('key', 1, actionItemId, filterModels);

      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        customViews: mockState.customViews.map((view) =>
          view.id === 1
            ? {
                ...view,
                state: {
                  columnState: [],
                  filterState: [
                    localStorageFilterState,
                    { actionItemId, filterModels },
                  ],
                },
              }
            : view
        ),
      });
    });
  });

  describe('getColumnFilters', () => {
    test('should return empty array when no filterModels are present', () => {
      const state: GridState = {
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: { columnState: [] },
          },
        ],
      } as unknown as GridState;
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue(state.customViews[0]);
      const result = service['getColumnFilters']('key', 1);
      expect(result).toEqual([]);
    });
    test('should return the filterModels of the current view when present', () => {
      const filterState = [
        { actionItemId: 'id', filterModels: { test: 'test' } },
      ];
      const state: GridState = {
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: { columnState: [], filterState },
          },
        ],
      } as unknown as GridState;
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue(state.customViews[0]);
      const result = service['getColumnFilters']('key', 1);
      expect(result).toEqual(filterState);
    });
  });

  describe('cleanupRemovedColumns', () => {
    test('should remove columns from columnState that are not in columnIds', () => {
      const columnIds = ['test', 'test2'];
      service['columnIds'] = columnIds;
      service[
        'gridMergeService'
      ].getUpdateCustomViewsWhenConfiguredColumnsRemoved = jest
        .fn()
        .mockReturnValue(true);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service['cleanupRemovedColumns'](mockState);
      expect(service['saveGridState']).toHaveBeenCalledWith({
        ...mockState,
        initialColIds: columnIds,
      });
    });

    test('should not remove the columns from columnState when they are in columnIds', () => {
      service[
        'gridMergeService'
      ].getUpdateCustomViewsWhenConfiguredColumnsRemoved = jest
        .fn()
        .mockReturnValue(false);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});
      service['cleanupRemovedColumns'](mockState);
      expect(service['saveGridState']).not.toHaveBeenCalled();
    });
  });
});
