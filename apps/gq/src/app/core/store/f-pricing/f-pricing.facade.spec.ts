import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK } from '../../../../testing/mocks/models/fpricing/market-value-drivers.mock';
import { MATERIAL_INFORMATION_EXTENDED_MOCK } from '../../../../testing/mocks/models/fpricing/material-information.mock';
import { TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK } from '../../../../testing/mocks/models/fpricing/technical-value-drivers.mock';
import { loadMaterialSalesOrg } from '../actions/material-sales-org/material-sales-org.actions';
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
  let actions$: Actions;

  const createService = createServiceFactory({
    service: FPricingFacade,
    providers: [provideMockStore({}), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);
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
        mockStore.overrideSelector(
          fPricingFeature.getMarketValueDriverForDisplay,
          MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK
        );
        mockStore.overrideSelector(
          fPricingFeature.getAnyMarketValueDriverSelected,
          false
        );

        mockStore.overrideSelector(
          fPricingFeature.getComparableTransactionsForDisplaying,
          []
        );
        mockStore.overrideSelector(
          fPricingFeature.getComparableTransactionsAvailable,
          false
        );
        mockStore.overrideSelector(
          fPricingFeature.getTechnicalValueDriversForDisplay,
          TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK
        );

        m.expect(service.fPricingDataComplete$).toBeObservable(
          m.cold('a', {
            a: {
              ...initialState,
              gqPositionId: '1234',
              referencePrice: 100_000,
              currency: 'EUR',
              materialSalesOrg: { materialStatus: 'f' } as MaterialSalesOrg,
              materialSalesOrgAvailable: true,
              marketValueDriversDisplay: MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK,
              anyMarketValueDriverSelected: false,
              comparableTransactionsForDisplay: [],
              comparableTransactionsAvailable: false,
              technicalValueDriversForDisplay:
                TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK,
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
    test('comparableTransactionsLoading$', () => {
      mockStore.overrideSelector(
        fPricingFeature.selectComparableTransactionsLoading,
        true
      );
      service.comparableTransactionsLoading$.subscribe((res) =>
        expect(res).toBe(true)
      );
    });

    test('fPricingDataLoading$', () => {
      mockStore.overrideSelector(
        fPricingFeature.selectFPricingDataLoading,
        true
      );
      service.fPricingDataLoading$.subscribe((res) => expect(res).toBe(true));
    });
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
      const action2 = FPricingActions.loadComparableTransactions({
        gqPositionId,
      });

      service.loadDataForPricingAssistant(gqPositionId);

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
      expect(mockStore.dispatch).toHaveBeenCalledWith(salesOrgAction);
      expect(mockStore.dispatch).toHaveBeenCalledWith(action2);
    });
  });

  describe('resetDataForPricingAssistant', () => {
    test('should dispatch resetFPricingData', () => {
      const action = FPricingActions.resetFPricingData();

      service.resetDataForPricingAssistant();

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('update FPricing data', () => {
    test('should dispatch updateFPricing', () => {
      const gqPositionId = '1234';
      const action = FPricingActions.updateFPricing({ gqPositionId });

      service.updateFPricingData(gqPositionId);

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    });

    test(
      'should dispatch update FPricing success',
      marbles((m) => {
        const action = FPricingActions.updateFPricingSuccess({} as any);
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(service.updateFPricingDataSuccess$).toBeObservable(
          expected as any
        );
      })
    );

    test('should dispatch setMarketValueDriverSelection', () => {
      const selection: MarketValueDriverSelection = {
        questionId: 1,
        selectedOptionId: 1,
      };
      const action = FPricingActions.setMarketValueDriverSelection({
        selection,
      });

      service.setMarketValueDriverSelection(selection);

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('changePrice', () => {
    test('should dispatch changePrice', () => {
      const price = 100_000;
      const action = FPricingActions.changePrice({ price });

      service.changePrice(price);

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('updateTechnicalValueDriverForDisplay', () => {
    test('should dispatch updateTechnicalValueDriver', () => {
      const technicalValueDriver = {
        description: 'translate it',
        id: 1,
        value: '5%',
        editableValue: 5,
        editableValueUnit: '%',
      };
      const action = FPricingActions.updateTechnicalValueDriver({
        technicalValueDriver,
      });

      service.updateTechnicalValueDriver(technicalValueDriver);

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
