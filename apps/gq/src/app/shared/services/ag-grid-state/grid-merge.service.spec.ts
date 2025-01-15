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
    test('merges columns properly preserving state from old columns', () => {
      const oldColumns: ColumnState[] = [
        { colId: 'col1', hide: false },
        { colId: 'col2', hide: true },
      ];
      const newColumns: ColumnState[] = [
        { colId: 'col1', hide: false },
        { colId: 'col2', hide: false },
        { colId: 'col3', hide: false },
      ];

      const result = service.mergeAndReorderColumns(oldColumns, newColumns);

      expect(result).toEqual([
        { colId: 'col1', hide: false },
        { colId: 'col2', hide: true },
        { colId: 'col3', hide: true }, // Newly added columns should be hidden by default
      ]);
    });

    test('handles case when no columns match', () => {
      const oldColumns: ColumnState[] = [{ colId: 'col1', hide: false }];
      const newColumns: ColumnState[] = [{ colId: 'col2', hide: false }];

      const result = service.mergeAndReorderColumns(oldColumns, newColumns);

      expect(result).toEqual([
        { colId: 'col2', hide: true }, // New column should be hidden
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
