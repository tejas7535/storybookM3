import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { fetchBearinxVersions, getCalculation } from '../../actions';
import {
  getReportUrls,
  getVersions,
} from '../../selectors/calculation-result/calculation-result.selector';
import { CalculationResultFacade } from './calculation-result.facade';

describe('CalculationResultFacade', () => {
  let facade: CalculationResultFacade;
  let spectator: SpectatorService<CalculationResultFacade>;
  let store: MockStore;

  const createFacade = createServiceFactory({
    service: CalculationResultFacade,
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: getReportUrls,
            value: {},
          },
          {
            selector: getVersions,
            value: [],
          },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createFacade();
    facade = spectator.service;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('reportUrls', () => {
    it('should return the selector value', (done) => {
      setTimeout(() => {
        expect(facade.reportUrls()).toEqual({});
        done();
      }, 4000);
    });
  });

  describe('bearinxVersions', () => {
    it('should return the selector value', () => {
      expect(facade.bearinxVersions()).toEqual([]);
    });
  });

  describe('fetchBearinxVersions', () => {
    it('should dispatch fetchBearinxVersions action', () => {
      facade.fetchBearinxVersions();
      expect(store.dispatch).toHaveBeenCalledWith(fetchBearinxVersions());
    });
  });

  describe('getCalculation', () => {
    it('should dispatch getCalculation action', () => {
      facade.getCalculation();
      expect(store.dispatch).toHaveBeenCalledWith(getCalculation());
    });
  });
});
