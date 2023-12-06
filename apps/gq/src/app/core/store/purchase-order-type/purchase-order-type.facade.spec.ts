import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { selectPurchaseOrderType } from '../actions/create-case/create-case.actions';
import { PurchaseOrderTypeFacade } from './purchase-order-type.facade';
import { purchaseOrderTypeFeature } from './purchase-order-type.reducer';

describe('PurchaseOrderTypeFacade', () => {
  let service: PurchaseOrderTypeFacade;
  let spectator: SpectatorService<PurchaseOrderTypeFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: PurchaseOrderTypeFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('Observables', () => {
    test(
      'should provide purchaseOrderTypes$',
      marbles((m) => {
        mockStore.overrideSelector(
          purchaseOrderTypeFeature.selectPurchaseOrderTypes,
          []
        );
        m.expect(service.purchaseOrderTypes$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );

    test(
      'should provide selectedPurchaseOrderType$',
      marbles((m) => {
        const selectedPurchaseOrderType = { name: 'test', id: 'test' };
        mockStore.overrideSelector(
          purchaseOrderTypeFeature.getSelectedPurchaseOrderType,
          selectedPurchaseOrderType
        );
        m.expect(service.selectedPurchaseOrderType$).toBeObservable(
          m.cold('a', { a: selectedPurchaseOrderType })
        );
      })
    );
  });

  describe('methods', () => {
    test('should dispatch selectPurchaseOrderType', () => {
      mockStore.dispatch = jest.fn();
      const purchaseOrderType = { name: 'test', id: 'test' };
      service.purchaseOrderTypes$ = of([
        purchaseOrderType,
        { name: 'test_name2', id: 'test2' },
      ]);
      service.selectPurchaseOrderTypeForCaseCreation(purchaseOrderType);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        selectPurchaseOrderType({
          purchaseOrderType,
        })
      );
    });
  });
});
