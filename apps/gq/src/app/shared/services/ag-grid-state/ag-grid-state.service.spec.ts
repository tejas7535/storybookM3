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
    { id: 3, title: 'test view 1', state: { columnState: [] } },
    { id: 1, title: 'test view 2', state: { columnState: [] } },
    { id: 2, title: 'test view 3', state: { columnState: [{ colId: 'new' }] } },
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

      const expectedKey = 'GQ_PROCESS_CASE_STATE';

      service.init('process_case');

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

    test('should add initialColumns field when Key is present and ColumnId are given', () => {
      service['gridLocalStorageService'].getGridState = jest
        .fn()
        .mockReturnValue(mockState);
      service['saveGridState'] = jest.fn().mockImplementation(() => {});

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
      service['cleanupRemovedColumns'] = jest.fn();

      service.init('process_case', null, ['col1']);

      expect(service['cleanupRemovedColumns']).toHaveBeenCalledTimes(1);
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
      ).toHaveBeenCalledWith('1234_items', [
        { gqPositionId: '10', quotationItemId: undefined },
      ]);
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
      service['activeViewId'] = 1;
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
      service['activeViewId'] = 1;
      service['activeTableKey'] = 'test';
      service.getColumnStateForCurrentView();
      expect(service['getColumnState']).toHaveBeenCalledWith('test', 1);
    });
  });

  describe('setColumnStateForCurrentView', () => {
    test('should call method with correct parameters', () => {
      const columnState: ColumnState[] = [{ colId: 'test', hide: true }];
      service['setColumnState'] = jest.fn();
      service['activeViewId'] = 1;
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
      service['activeViewId'] = 0;
      service['updateColumnState'] = jest.fn();
      service['updateViews'] = jest.fn();
      service['updateFilterState'] = jest.fn();
      service.setActiveView(1);
      expect(service['activeViewId']).toBe(1);
      expect(service['updateColumnState']).toHaveBeenCalled();
      expect(service['updateViews']).toHaveBeenCalled();
      expect(service['updateFilterState']).toHaveBeenCalled();
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
      service['activeViewId'] = 1;
      const result = service.getCurrentViewId();
      expect(result).toBe(1);
    });
  });

  describe('createViewFromScratch', () => {
    test('should create a new view from scratch', () => {
      service['createNewView'] = jest.fn();
      service.createViewFromScratch('new view');
      expect(service['createNewView']).toHaveBeenCalledWith('new view', []);
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
        } as CustomView);
      service['createNewView'] = jest.fn();
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
      service['saveGridState'] = jest.fn();
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
      service['saveGridState'] = jest.fn();
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
    test('should reset filter models of default view', () => {
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

  test('clearDefaultViewColumnAndFilterState should clear Column and Filter State', () => {
    const state: GridState = {
      customViews: [
        {
          id: 0,
          title: translatedViewName,
          state: {
            columnState: [{ colId: 'test', hide: true }],
            filterState: [{ actionItemId: 'id' }],
          },
        } as CustomView,
      ],
    } as GridState;

    service['gridLocalStorageService'].getGridState = jest
      .fn()
      .mockReturnValue(state);
    service['saveGridState'] = jest.fn();
    service.clearDefaultViewColumnAndFilterState();
    expect(service['saveGridState']).toHaveBeenCalledWith({
      ...state,
      customViews: [
        {
          id: 0,
          title: translatedViewName,
          state: {
            columnState: [],
            filterState: [],
          },
        },
      ],
    });
  });

  test('renameQuotationIdToActionItemForProcessCaseState should call method', () => {
    service[
      'gridLocalStorageService'
    ].renameQuotationIdToActionItemForProcessCaseState = jest.fn();
    service.renameQuotationIdToActionItemForProcessCaseState();

    expect(
      service['gridLocalStorageService']
        .renameQuotationIdToActionItemForProcessCaseState
    ).toHaveBeenCalled();
  });

  describe('setColumnState', () => {
    test('should set columnState', () => {
      const columnState: ColumnState[] = [{ colId: 'test', hide: true }];
      const viewId = 1;
      const tableKey = 'test';
      service['saveGridState'] = jest.fn();
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
      service['saveGridState'] = jest.fn();
      service['updateViews'] = jest.fn();
      service['updateFilterState'] = jest.fn();
      service['updateColumnState'] = jest.fn();
      service['getColumnFilters'] = jest.fn().mockReturnValue(filterState);
      service['generateViewId'] = jest.fn().mockReturnValue(12);
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
      expect(service['updateFilterState']).toHaveBeenCalled();
      expect(service['updateColumnState']).toHaveBeenCalled();
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

  describe('saveGridState', () => {
    beforeEach(() => {
      service['gridLocalStorageService'].setGridState = jest.fn();
      service['gridMergeService'].mergeAndReorderColumns = jest.fn(() => []);

      service['updateViews'] = jest.fn();
      service['updateColumnState'] = jest.fn();
      service['updateFilterState'] = jest.fn();
      service['activeTableKey'] = 'key';
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
      expect(service['updateColumnState']).toHaveBeenCalled();
      expect(service['updateFilterState']).toHaveBeenCalled();
      expect(
        service['gridLocalStorageService'].setGridState
      ).toHaveBeenCalledWith('key', mockState);
    });

    test('should call mergeAndReorderColumns if there are differences', () => {
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue({ state: { columnState: [{ colId: 'test' }] } });
      service['activeViewId'] = 2;
      service['DEFAULT_VIEW_ID'] = 0;
      service['columnIds'] = ['test'];

      service['saveGridState'](mockState);

      expect(
        service['gridMergeService'].mergeAndReorderColumns
      ).toHaveBeenCalled();
      expect(service['updateViews']).toHaveBeenCalled();
      expect(service['updateColumnState']).toHaveBeenCalled();
      expect(service['updateFilterState']).toHaveBeenCalled();
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
      service['activeViewId'] = 1;

      service['updateViews']();
      expect(service.views.value).toEqual([
        { active: false, id: 0 } as ViewToggle,
        { active: true, id: 1 } as ViewToggle,
      ]);
    });

    test('should return empty array when no views are present', () => {
      service['getCustomViews'] = jest.fn().mockReturnValue([]);
      service['activeViewId'] = 1;

      service['updateViews']();
      expect(service.views.value).toEqual([]);
    });
  });

  describe('updateColumnState', () => {
    test('should update the columnState', () => {
      service.columnState.next(null);
      service['getColumnStateForCurrentView'] = jest
        .fn()
        .mockReturnValue([{ colId: 'test', hide: true }]);
      service['updateColumnState']();
      expect(service.columnState.value).toEqual([
        { colId: 'test', hide: true },
      ]);
    });
  });

  describe('updateFilterState', () => {
    test('should update the filterState', () => {
      service.filterState.next(null);
      service['getColumnFiltersForCurrentView'] = jest
        .fn()
        .mockReturnValue([{ actionItemId: 'test' }]);
      service['updateFilterState']();
      expect(service.filterState.value).toEqual([{ actionItemId: 'test' }]);
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
      service['saveGridState'] = jest.fn();

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
      service['saveGridState'] = jest.fn();

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
      service['saveGridState'] = jest.fn();

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
      } as GridState;
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
        initialColIds: [],
      } as GridState;
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue(state.customViews[0]);
      const result = service['getColumnFilters']('key', 1);
      expect(result).toEqual(filterState);
    });
  });

  describe('getColumnState', () => {
    test('should return the columnState of the current view when present', () => {
      const columnState: ColumnState[] = [{ colId: 'test', hide: true }];
      const state: GridState = {
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: { columnState },
          },
        ],
      } as GridState;
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue(state.customViews[0]);
      const result = service['getColumnState']('key', 1);
      expect(result).toEqual(columnState);
    });

    test('should return empty array when no columnState is present', () => {
      const state: GridState = {
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: { columnState: [] },
          },
        ],
      } as GridState;
      service['gridLocalStorageService'].getViewById = jest
        .fn()
        .mockReturnValue(state.customViews[0]);
      const result = service['getColumnState']('key', 1);
      expect(result).toEqual([]);
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
      service['saveGridState'] = jest.fn();
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
      service['saveGridState'] = jest.fn();
      service['cleanupRemovedColumns'](mockState);
      expect(service['saveGridState']).not.toHaveBeenCalled();
    });
  });
});
