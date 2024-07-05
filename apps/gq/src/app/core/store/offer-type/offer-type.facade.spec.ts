import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { selectOfferType } from '../actions';
import { OfferTypeFacade } from './offer-type.facade';
import { offerTypeFeature } from './offer-type.reducer';

describe('OfferTypeFacade', () => {
  let spectator: SpectatorService<OfferTypeFacade>;
  let service: OfferTypeFacade;
  let mockStore: MockStore;
  const createService = createServiceFactory({
    service: OfferTypeFacade,
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
      'should provide offerTypes$',
      marbles((m) => {
        mockStore.overrideSelector(offerTypeFeature.selectOfferTypes, []);
        m.expect(service.offerTypes$).toBeObservable(m.cold('a', { a: [] }));
      })
    );

    test(
      'should provide selectedOfferType$',
      marbles((m) => {
        const selectedOfferType = { name: 'test', id: 1 };
        mockStore.overrideSelector(
          offerTypeFeature.getSelectedOfferType,
          selectedOfferType
        );
        m.expect(service.selectedOfferType$).toBeObservable(
          m.cold('a', { a: selectedOfferType })
        );
      })
    );
  });

  describe('methods', () => {
    test('should dispatch getAllOfferTypes', () => {
      mockStore.dispatch = jest.fn();
      service.getAllOfferTypes();
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    test('should dispatch selectOfferType', () => {
      mockStore.dispatch = jest.fn();
      const offerType = { name: 'test', id: 1 };
      service.offerTypes$ = of([offerType, { name: 'test_name2', id: 2 }]);
      service.selectOfferTypeForCaseCreation(offerType);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        selectOfferType({
          offerType,
        })
      );
    });
  });
});
