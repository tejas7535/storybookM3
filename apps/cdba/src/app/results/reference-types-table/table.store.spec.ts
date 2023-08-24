import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles/jest';

import { TableStore } from './table.store';

describe('TableStore', () => {
  let spectator: SpectatorService<TableStore>;
  let store: TableStore;

  const createService = createServiceFactory(TableStore);

  beforeEach(() => {
    spectator = createService();
    store = spectator.service;
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  describe('setFilters', () => {
    it(
      'should patch filters in state',
      marbles((m) => {
        const mockFilters = {
          sqv: {
            type: 'number',
            value: 10,
          },
        };
        store.setFilters(mockFilters);

        m.expect(store.state$).toBeObservable(
          m.hot('a', { a: { filters: mockFilters } })
        );
      })
    );
  });
});
