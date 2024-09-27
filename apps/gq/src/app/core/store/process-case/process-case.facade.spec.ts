import { MaterialTableItem } from '@gq/shared/models/table';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ProcessCaseActions } from './process-case.action';
import { ProcessCaseFacade } from './process-case.facade';

describe('ProcessCaseFacade', () => {
  let facade: ProcessCaseFacade;
  let mockStore: MockStore;
  let spectator: SpectatorService<ProcessCaseFacade>;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: ProcessCaseFacade,
    imports: [],
    providers: [provideMockStore(), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);
  });

  describe('methods', () => {
    describe('updateItemFromMaterialTable', () => {
      test('should dispatch updateItemFromMaterialTable action', () => {
        const recentData = {
          id: 1,
          currency: 'EUR',
        } as MaterialTableItem;
        const revalidate = false;
        const spy = jest.spyOn(mockStore, 'dispatch');
        facade.updateItemFromMaterialTable(recentData, revalidate);
        expect(spy).toHaveBeenCalledWith(
          ProcessCaseActions.updateItemFromMaterialTable({
            item: recentData,
            revalidate,
          })
        );
      });
    });

    describe('validateMaterialTableItems', () => {
      test('should dispatch validateMaterialTableItems action', () => {
        const spy = jest.spyOn(mockStore, 'dispatch');
        facade.validateMaterialTableItems();
        expect(spy).toHaveBeenCalledWith(
          ProcessCaseActions.validateMaterialTableItems()
        );
      });
    });
  });
});
