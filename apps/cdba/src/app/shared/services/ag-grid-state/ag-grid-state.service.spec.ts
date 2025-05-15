import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { ColumnState } from 'ag-grid-enterprise';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { AgGridStateService } from './ag-grid-state.service';

describe('AgGridStateService', () => {
  let spectator: SpectatorService<AgGridStateService>;
  let service: AgGridStateService;
  let localStorageService: LocalStorageService;

  const createService = createServiceFactory({
    service: AgGridStateService,
    providers: [mockProvider(LocalStorageService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(AgGridStateService);
    localStorageService = spectator.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getColumnState', () => {
    it('should return undefined if theres no entry in localstorage', () => {
      localStorageService.getItem = jest.fn();
      const spy = jest.spyOn(localStorageService, 'getItem');

      const result = service.getColumnState('any');

      expect(result).toBeUndefined();
      expect(spy).toHaveBeenCalledWith('any', true);
    });

    it('should return columns for given key', () => {
      localStorageService.getItem = jest
        .fn()
        .mockReturnValue({ columnState: [{ colId: 'width', pinned: 'left' }] });

      const result = service.getColumnState('key');

      expect(result).toEqual([{ colId: 'width', pinned: 'left' }]);
      expect(localStorageService.getItem).toHaveBeenCalledWith('key', true);
    });
  });

  describe('setColumnsState', () => {
    it('should set the given column state in localstorage', () => {
      const spy = jest.spyOn(localStorageService, 'setItem');

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];

      service.setColumnState('key', columnState);

      expect(spy).toHaveBeenCalledWith(
        'key',
        {
          columnState: [{ colId: 'width', pinned: 'left' }],
        },
        true
      );
    });

    it('should extend localstorage if key is already present', () => {
      const spy = jest.spyOn(localStorageService, 'setItem');

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];

      service.setColumnState('key', columnState);

      expect(spy).toHaveBeenCalledWith(
        'key',
        {
          columnState: [{ colId: 'width', pinned: 'left' }],
        },
        true
      );
    });
  });
});
