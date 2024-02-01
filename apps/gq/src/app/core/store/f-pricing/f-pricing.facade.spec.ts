import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MATERIAL_INFORMATION_EXTENDED_MOCK } from '../../../../testing/mocks/models/fpricing/material-information.mock';
import { loadMaterialSalesOrg } from '../actions/material-sales-org/material-sales-org.actions';
import { getQuotationCurrency } from '../active-case';
import {
  getMaterialSalesOrg,
  getMaterialSalesOrgDataAvailable,
} from '../selectors/material-sales-org/material-sales-org.selector';
import { FPricingActions } from './f-pricing.actions';
import { FPricingFacade } from './f-pricing.facade';
import { fPricingFeature, initialState } from './f-pricing.reducer';

describe('Service: FPricingFacade', () => {
  let service: FPricingFacade;
  let spectator: SpectatorService<FPricingFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: FPricingFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    mockStore.dispatch = jest.fn();
    jest.resetAllMocks();
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should provide Observables', () => {
    test(
      'should provide fPricingDataComplete$',
      marbles((m) => {
        mockStore.overrideSelector(fPricingFeature.selectFPricingState, {
          ...initialState,
          gqPositionId: '1234',
          referencePrice: 100_000,
        });

        mockStore.overrideSelector(getQuotationCurrency, 'EUR');
        mockStore.overrideSelector(getMaterialSalesOrg, {
          materialStatus: 'f',
        } as MaterialSalesOrg);
        mockStore.overrideSelector(getMaterialSalesOrgDataAvailable, true);
        m.expect(service.fPricingDataComplete$).toBeObservable(
          m.cold('a', {
            a: {
              ...initialState,
              gqPositionId: '1234',
              referencePrice: 100_000,
              currency: 'EUR',
              materialSalesOrg: { materialStatus: 'f' } as MaterialSalesOrg,
              materialSalesOrgAvailable: true,
            },
          })
        );
      })
    );
    test(
      'should provide referencePrice$',
      marbles((m) => {
        mockStore.overrideSelector(
          fPricingFeature.selectReferencePrice,
          100_000
        );
        m.expect(service.referencePrice$).toBeObservable(
          m.cold('a', { a: 100_000 })
        );
      })
    );
    test(
      'should provide materialInformation',
      marbles((m) => {
        mockStore.overrideSelector(
          fPricingFeature.getMaterialInformationExtended,
          MATERIAL_INFORMATION_EXTENDED_MOCK
        );
        m.expect(service.materialInformation$).toBeObservable(
          m.cold('a', { a: MATERIAL_INFORMATION_EXTENDED_MOCK })
        );
      })
    );

    test(
      'should provide materialSalesOrg$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialSalesOrg, {} as MaterialSalesOrg);
        m.expect(service.materialSalesOrg$).toBeObservable(
          m.cold('a', { a: {} as MaterialSalesOrg })
        );
      })
    );
    test(
      'should provide materialSalesOrgDataAvailable$',
      marbles((m) => {
        mockStore.overrideSelector(getMaterialSalesOrgDataAvailable, true);
        m.expect(service.materialSalesOrgDataAvailable$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  // #########################################
  // ##########     methods     ##############
  // #########################################
  describe('loadDataForPricingAssistant', () => {
    test('should dispatch loadFPricingData', () => {
      const gqPositionId = '1234';
      const action = FPricingActions.loadFPricingData({ gqPositionId });
      const salesOrgAction = loadMaterialSalesOrg({
        gqPositionId,
      });

      service.loadDataForPricingAssistant(gqPositionId);

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
      expect(mockStore.dispatch).toHaveBeenCalledWith(salesOrgAction);
    });
  });
});
