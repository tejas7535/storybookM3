import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getBannerOpen } from '@schaeffler/banner';

import * as GlobalSelectors from '../../selectors/global/global.selector';
import { GlobalFacade } from './global.facade';

describe('GlobalFacade', () => {
  let facade: GlobalFacade;
  let spectator: SpectatorService<GlobalFacade>;

  let store: MockStore;

  const createService = createServiceFactory({
    service: GlobalFacade,
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: GlobalSelectors.getIsInitialized,
            value: false,
          },
          {
            selector: GlobalSelectors.getIsStandalone,
            value: false,
          },
          {
            selector: GlobalSelectors.getAppDelivery,
            value: 'Embedded',
          },
          {
            selector: GlobalSelectors.getAppDeliveryEmbedded,
            value: true,
          },
          {
            selector: GlobalSelectors.getIsInternalUser,
            value: false,
          },
          {
            selector: getBannerOpen,
            value: false,
          },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  describe('isInitialized$', () => {
    it('should return the initialized state', () => {
      const expected = false;
      facade.isInitialized$.subscribe((value) => {
        expect(value).toBe(expected);
      });
    });
  });

  describe('isStandalone$', () => {
    it('should return the isStandalone state', () => {
      const expected = false;
      facade.isStandalone$.subscribe((value) => {
        expect(value).toBe(expected);
      });
    });
  });

  describe('appDelivery$', () => {
    it('should return the appDelivery state', () => {
      const expected = 'Embedded';
      facade.appDelivery$.subscribe((value) => {
        expect(value).toBe(expected);
      });
    });
  });

  describe('appDeliveryEmbedded$', () => {
    it('should return the appDeliveryEmbedded state', () => {
      const expected = true;
      facade.appDeliveryEmbedded$.subscribe((value) => {
        expect(value).toBe(expected);
      });
    });
  });

  describe('isInternalUser$', () => {
    it('should return the isInternalUser state', () => {
      const expected = false;
      facade.isInternalUser$.subscribe((value) => {
        expect(value).toBe(expected);
      });
    });
  });

  describe('isBannerOpened$', () => {
    it('should return the bannerOpen state', () => {
      const expected = false;
      facade.isBannerOpened$.subscribe((value) => {
        expect(value).toBe(expected);
      });
    });
  });

  describe('initGlobal', () => {
    it('should dispatch the initGlobal action', () => {
      facade.initGlobal();
      expect(store.dispatch).toHaveBeenCalled();
    });
  });
});
