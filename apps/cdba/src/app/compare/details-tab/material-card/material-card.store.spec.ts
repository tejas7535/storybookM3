import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles/jest';

import { MaterialCardStore } from './material-card.store';

describe('MaterialCardStore', () => {
  let service: MaterialCardStore;
  let spectator: SpectatorService<MaterialCardStore>;

  const createService = createServiceFactory({
    service: MaterialCardStore,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    service.setState({
      expandedItems: [0, 1],
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('expandedItems$', () => {
    it(
      'should provide expandedItems',
      marbles((m) => {
        const expandedItems = [0, 1];

        m.expect(service.expandedItems$).toBeObservable(
          m.cold('a', { a: expandedItems })
        );
      })
    );
  });

  describe('addExpandedItem', () => {
    it(
      'should add one expandedItem',
      marbles((m) => {
        const expandedItems = [0, 1, 2];

        service.addExpandedItem(2);

        m.expect(service.expandedItems$).toBeObservable(
          m.cold('a', { a: expandedItems })
        );
      })
    );
  });

  describe('removeExpandedItem', () => {
    it(
      'should remove one expandedItem if present',
      marbles((m) => {
        const expandedItems = [0];

        service.removeExpandedItem(1);

        m.expect(service.expandedItems$).toBeObservable(
          m.cold('a', { a: expandedItems })
        );
      })
    );

    it(
      'should not remove anything if item is not present',
      marbles((m) => {
        const expandedItems = [0, 1];

        service.removeExpandedItem(2);

        m.expect(service.expandedItems$).toBeObservable(
          m.cold('a', { a: expandedItems })
        );
      })
    );
  });
});
