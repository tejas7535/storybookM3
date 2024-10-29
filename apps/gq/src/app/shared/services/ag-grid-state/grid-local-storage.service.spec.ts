import {
  CustomView,
  GridState,
  ViewState,
} from '@gq/shared/models/grid-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { GridLocalStorageService } from './grid-local-storage.service';

describe('GridService', () => {
  let spectator: SpectatorService<GridLocalStorageService>;
  let service: GridLocalStorageService;
  const translatedViewName = 'translate it';

  const mockedGridState: GridState = {
    version: 1,
    initialColIds: ['col1', 'col2'],
    customViews: [
      {
        id: 0,
        state: {
          columnState: [],
          filterState: [],
        },
        title: translatedViewName,
      } as CustomView,
      {
        id: 1,
        state: {
          columnState: [{ colId: 'col1' }, { colId: 'col2' }],
          filterState: [],
        },
        title: 'test',
      },
    ],
  };

  const initialMockState: GridState = {
    version: 1,
    customViews: [
      {
        id: 0,
        title: translatedViewName,
        state: { columnState: [] } as ViewState,
      },
    ],
    initialColIds: mockedGridState.initialColIds,
  };

  const createService = createServiceFactory({
    service: GridLocalStorageService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      MockProvider(LocalStorageService, {
        getFromLocalStorage: jest.fn(),
        setToLocalStorage: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(GridLocalStorageService);
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getViewById', () => {
    test('should return the requested View', () => {
      service.getGridState = jest.fn().mockReturnValue(mockedGridState);
      const result = service.getViewById('key', 1);
      expect(result).toEqual(mockedGridState.customViews[1]);
    });
  });

  describe('getGridState', () => {
    test('should get the Value from LocalStorage', () => {
      service['localStorageService'].getFromLocalStorage = jest.fn();
      service.getGridState('key');
      expect(
        service['localStorageService'].getFromLocalStorage
      ).toHaveBeenCalledWith('key');
    });
  });

  describe('setGridState', () => {
    test('should set the Value to LocalStorage', () => {
      service['localStorageService'].setToLocalStorage = jest.fn();
      service.setGridState('key', mockedGridState);
      expect(
        service['localStorageService'].setToLocalStorage
      ).toHaveBeenCalledWith('key', mockedGridState);
    });
  });

  describe('createInitialLocalStorage', () => {
    test('should set the initial state to LocalStorage', () => {
      service.setGridState = jest.fn();
      service.createInitialLocalStorage(
        'key',
        null,
        mockedGridState.initialColIds
      );
      expect(service.setGridState).toHaveBeenCalledWith(
        'key',
        initialMockState
      );
    });

    test('should set with additionViews', () => {
      const additionalViews = [
        {
          id: 1,
          title: 'test',
          state: {
            columnState: [{ colId: 'col1' }, { colId: 'col2' }],
          } as ViewState,
        },
      ];
      const expectedState = {
        ...initialMockState,
        customViews: [...initialMockState.customViews, ...additionalViews],
      };
      service.setGridState = jest.fn();
      service.createInitialLocalStorage(
        'key',
        additionalViews,
        mockedGridState.initialColIds
      );
      expect(service.setGridState).toHaveBeenCalledWith('key', expectedState);
    });
  });

  describe('renameQuotationIdToActionItemForProcessCaseState', () => {
    const mockGridState = {
      version: 1,
      customViews: [
        {
          id: 0,
          title: 'Default',
          state: {
            columnState: [],
            filterState: [
              {
                quotationId: '46426',
                filterModels: { colId: 'width', pinned: 'right' },
              } as any,
            ],
          },
        },
      ],
    } as GridState;
    const renamedGridState = {
      version: 1,
      customViews: [
        {
          id: 0,
          title: 'Default',
          state: {
            columnState: [],
            filterState: [
              {
                actionItemId: '46426',
                filterModels: { colId: 'width', pinned: 'right' },
              } as any,
            ],
          },
        },
      ],
    } as GridState;
    test('should return if gridState is null', () => {
      service['localStorageService'].setToLocalStorage = jest.fn();

      service['getGridState'] = jest
        .fn()
        .mockReturnValue(undefined as GridState);

      service.renameQuotationIdToActionItemForProcessCaseState();
      expect(service['getGridState']).toHaveBeenCalledTimes(1);
      expect(
        service['localStorageService'].setToLocalStorage
      ).not.toHaveBeenCalled();
    });

    test('should rename quotationItemId to actionItemId', () => {
      service['getGridState'] = jest.fn().mockReturnValue(mockGridState);
      service['localStorageService'].setToLocalStorage = jest.fn();

      service.renameQuotationIdToActionItemForProcessCaseState();

      expect(service['getGridState']).toHaveBeenCalledTimes(1);
      expect(
        service['localStorageService'].setToLocalStorage
      ).toHaveBeenCalledTimes(1);
      expect(
        service['localStorageService'].setToLocalStorage
      ).toHaveBeenCalledWith('GQ_PROCESS_CASE_STATE', renamedGridState);
    });

    test('should not rename when already done', () => {
      service['getGridState'] = jest.fn().mockReturnValue(renamedGridState);
      service['localStorageService'].setToLocalStorage = jest.fn();

      service.renameQuotationIdToActionItemForProcessCaseState();

      expect(service['getGridState']).toHaveBeenCalledTimes(1);
      expect(
        service['localStorageService'].setToLocalStorage
      ).not.toHaveBeenCalledTimes(1);
    });
  });
});
