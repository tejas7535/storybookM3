import { SharedQuotationActions } from '@gq/core/store/shared-quotation/shared-quotation.actions';
import { sharedQuotationFeature } from '@gq/core/store/shared-quotation/shared-quotation.reducer';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { SHARED_QUOTATION_MOCK } from '../../../../testing/mocks/models/shared-quotation.mock';
import { SharedQuotationFacade } from './shared-quotation.facade';

describe('SharedQuotationService', () => {
  let facade: SharedQuotationFacade;
  let spectator: SpectatorService<SharedQuotationFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: SharedQuotationFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    mockStore = spectator.inject(MockStore);
  });

  test('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('sharedQuotation$', () => {
    test(
      'should select the sharedQuotation',
      marbles((m) => {
        const sharedQuotation = SHARED_QUOTATION_MOCK;
        mockStore.overrideSelector(
          sharedQuotationFeature.selectSharedQuotation,
          sharedQuotation
        );

        m.expect(facade.sharedQuotation$).toBeObservable(
          m.cold('a', { a: sharedQuotation })
        );
      })
    );
  });

  describe('sharedQuotationLoading$', () => {
    test(
      'should select sharedQuotationLoading property of shared quotation',
      marbles((m) => {
        const sharedQuotationLoading = true;
        mockStore.overrideSelector(
          sharedQuotationFeature.selectSharedQuotationLoading,
          sharedQuotationLoading
        );

        m.expect(facade.sharedQuotationLoading$).toBeObservable(
          m.cold('a', { a: sharedQuotationLoading })
        );
      })
    );
  });

  describe('getSharedQuotation', () => {
    test('should dispatch get shared quotation', () => {
      const gqId = 123;
      const action = SharedQuotationActions.getSharedQuotation({ gqId });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.getSharedQuotation(gqId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('saveSharedQuotation', () => {
    test('should dispatch save shared quotation action', () => {
      const gqId = 123;
      const action = SharedQuotationActions.saveSharedQuotation({ gqId });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.saveSharedQuotation(gqId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('deleteSharedQuotation', () => {
    test('should dispatch delete shared quotation action', () => {
      const id = '123';
      const action = SharedQuotationActions.deleteSharedQuotation({ id });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.deleteSharedQuotation(id);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
