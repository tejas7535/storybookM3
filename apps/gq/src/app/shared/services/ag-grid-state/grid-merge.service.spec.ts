import { GridState } from '@gq/shared/models/grid-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ColumnState } from 'ag-grid-enterprise';

import { GridMergeService } from './grid-merge.service';

describe('GridMergeService', () => {
  let spectator: SpectatorService<GridMergeService>;
  let service: GridMergeService;

  const createService = createServiceFactory({
    service: GridMergeService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('mergeAndReorderColumns', () => {
    test('places new columns beside its closest neighbor according to default order', () => {
      const oldColumns: ColumnState[] = [
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
        { colId: 'c', hide: false },
      ];
      const newColumns: ColumnState[] = [
        { colId: 'd', hide: false },
        { colId: 'e', hide: false },
      ];
      const defaultOrderColIds = ['a', 'b', 'c', 'd', 'e'];

      const result = service.mergeAndReorderColumns(
        oldColumns,
        newColumns,
        defaultOrderColIds
      );

      expect(result).toEqual([
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
        { colId: 'c', hide: false },
        { colId: 'd', hide: true }, // positioned next to 'c'
        { colId: 'e', hide: true }, // positioned next to 'd'
      ]);
    });

    test('handles case when all columns are new', () => {
      const oldColumns: ColumnState[] = [];
      const newColumns: ColumnState[] = [
        { colId: 'x', hide: false },
        { colId: 'y', hide: false },
      ];
      const defaultOrderColIds = ['x', 'y'];

      const result = service.mergeAndReorderColumns(
        oldColumns,
        newColumns,
        defaultOrderColIds
      );

      expect(result).toEqual([
        { colId: 'x', hide: true }, // new column, hidden by default
        { colId: 'y', hide: true }, // new column, hidden by default
      ]);
    });

    test('handles case when no columns are new', () => {
      const oldColumns: ColumnState[] = [
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
      ];
      const newColumns: ColumnState[] = [
        { colId: 'a', hide: true },
        { colId: 'b', hide: false },
      ];
      const defaultOrderColIds = ['a', 'b'];

      const result = service.mergeAndReorderColumns(
        oldColumns,
        newColumns,
        defaultOrderColIds
      );

      expect(result).toEqual([
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
      ]);
    });

    test('handles mixture of old and entirely new columns', () => {
      const oldColumns: ColumnState[] = [
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
      ];
      const newColumns: ColumnState[] = [
        { colId: 'c', hide: false },
        { colId: 'd', hide: false },
      ];
      const defaultOrderColIds = ['a', 'b', 'c', 'd'];

      const result = service.mergeAndReorderColumns(
        oldColumns,
        newColumns,
        defaultOrderColIds
      );

      expect(result).toEqual([
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
        { colId: 'c', hide: true }, // new column, hidden by default, positioned next to 'b'
        { colId: 'd', hide: true }, // new column, hidden by default, positioned next to 'c'
      ]);
    });

    test('maintains all old columns that are not present in new columns', () => {
      const oldColumns: ColumnState[] = [
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
        { colId: 'c', hide: false },
      ];
      const newColumns: ColumnState[] = [{ colId: 'b', hide: false }];
      const defaultOrderColIds = ['a', 'b', 'c'];

      const result = service.mergeAndReorderColumns(
        oldColumns,
        newColumns,
        defaultOrderColIds
      );

      expect(result).toEqual([
        { colId: 'a', hide: false },
        { colId: 'b', hide: true },
        { colId: 'c', hide: false },
      ]);
    });
  });

  describe('getUpdateCustomViewsWhenConfiguredColumnsRemoved', () => {
    test('returns true when a column is removed from configured columns', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2', 'col3'],
        customViews: [
          {
            id: 1,
            title: 'default',
            state: {
              columnState: [{ colId: 'col1' }, { colId: 'col2' }],
            },
          },
        ],
      } as GridState;

      const columnIds = ['col1']; // 'col2' is removed in new column configuration

      const result = service.getUpdateCustomViewsWhenConfiguredColumnsRemoved(
        gridState,
        0, // defaultViewId
        columnIds
      );

      expect(result).toBe(true);
    });

    test('returns false when no columns are removed from configured columns', () => {
      const gridState: GridState = {
        initialColIds: ['col1', 'col2'],
        customViews: [
          {
            id: 1,
            title: 'default',
            state: {
              columnState: [{ colId: 'col1' }, { colId: 'col2' }],
            },
          },
        ],
      } as GridState;

      const columnIds = ['col1', 'col2'];

      const result = service.getUpdateCustomViewsWhenConfiguredColumnsRemoved(
        gridState,
        0, // defaultViewId
        columnIds
      );

      expect(result).toBe(false);
    });
  });
});
