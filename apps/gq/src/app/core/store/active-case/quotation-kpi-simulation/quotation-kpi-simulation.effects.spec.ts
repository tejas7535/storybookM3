import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { QuotationKpiSimulationActions } from '@gq/core/store/active-case/quotation-kpi-simulation/quotation-kpi-simulation.action';
import { QuotationKpiSimulationEffects } from '@gq/core/store/active-case/quotation-kpi-simulation/quotation-kpi-simulation.effects';
import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { PriceSource, QuotationDetail } from '@gq/shared/models';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { QuotationDetailSimulatedKpi } from '@gq/shared/services/rest/calculation/model/quotation-detail-simulated-kpi.interface';
import { QuotationDetailsSimulatedKpi } from '@gq/shared/services/rest/calculation/model/quotation-details-simulated-kpi.interface';
import { QuotationDetailsSimulationKpiData } from '@gq/shared/services/rest/calculation/model/quotation-details-simulation-kpi-data.interface';
import { QuotationSimulatedKpiRequest } from '@gq/shared/services/rest/calculation/model/quotation-simulated-kpi-request.interface';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import {
  QUOTATION_DETAIL_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';

describe('QuotationKpiSimulationEffects', () => {
  let spectator: SpectatorService<QuotationKpiSimulationEffects>;
  let action: any;
  let actions$: any;
  let effects: QuotationKpiSimulationEffects;
  let calculationService: CalculationService;

  let store: any;
  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: QuotationKpiSimulationEffects,
    imports: [RouterTestingModule, HttpClientTestingModule],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockActions(() => actions$),
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(QuotationKpiSimulationEffects);
    store = spectator.inject(MockStore);

    calculationService = spectator.inject(CalculationService);
  });

  describe('calculateSimulatedSummaryQuotation$', () => {
    const simulatedQuotationDetails = [QUOTATION_DETAIL_MOCK];
    const selectedQuotationDetails = [QUOTATION_DETAIL_MOCK];
    const simulatedField = ColumnFields.PRICE;
    const gqId = 123;

    action = QuotationKpiSimulationActions.calculateSimulatedSummaryQuotation({
      gqId,
      simulatedField,
      simulatedQuotationDetails,
      selectedQuotationDetails,
    });

    test(
      'should return calculateSimulatedSummaryQuotationSuccess when KPI calculations are successful',
      marbles((m) => {
        const simulatedStatusBar = SIMULATED_QUOTATION_MOCK.simulatedStatusBar;
        const previousStatusBar = SIMULATED_QUOTATION_MOCK.previousStatusBar;

        calculationService.getQuotationKpiCalculation = jest
          .fn()
          .mockReturnValueOnce(of(simulatedStatusBar))
          .mockReturnValueOnce(of(previousStatusBar));

        actions$ = m.hot('-a', { a: action });

        const simulatedQuotation = {
          gqId,
          simulatedField,
          quotationDetails: simulatedQuotationDetails,
          simulatedStatusBar,
          previousStatusBar,
        };

        const result =
          QuotationKpiSimulationActions.calculateSimulatedSummaryQuotationSuccess(
            {
              simulatedQuotation,
            }
          );

        const expected = m.cold('-b', { b: result });

        m.expect(effects.calculateSimulatedSummaryQuotation$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          calculationService.getQuotationKpiCalculation
        ).toHaveBeenCalledTimes(2);
      })
    );

    test(
      'should return calculateSimulatedSummaryQuotationFailure when KPI calculation fails',
      marbles((m) => {
        const err = new Error(errorMessage);
        calculationService.getQuotationKpiCalculation = jest
          .fn()
          .mockReturnValueOnce(throwError(() => err));

        actions$ = m.hot('-a', { a: action });

        const result =
          QuotationKpiSimulationActions.calculateSimulatedSummaryQuotationFailure(
            {
              errorMessage: err as any,
            }
          );

        const expected = m.cold('-b', { b: result });

        m.expect(effects.calculateSimulatedSummaryQuotation$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          calculationService.getQuotationKpiCalculation
        ).toHaveBeenCalledTimes(2);
      })
    );
  });

  describe('resetSimulatedQuotation', () => {
    test(
      'should reset simulatedQuotation on route change',
      marbles((m) => {
        const queryParams = {
          gqId: 12_334,
          customerNumber: '3456',
          salesOrg: '0267',
          gqPositionId: '5678',
        };

        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams,
              url: `/${AppRoutePath.ProcessCaseViewPath}`,
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const result = QuotationKpiSimulationActions.resetSimulatedQuotation();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.resetSimulatedQuotation$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('confirmSimulatedQuotation$', () => {
    beforeEach(() => {
      store.overrideSelector(
        activeCaseFeature.selectSimulatedItem,
        SIMULATED_QUOTATION_MOCK
      );
    });

    test(
      'should updateQuotationDetails and resetSimulatedQuotation',
      marbles((m) => {
        action = QuotationKpiSimulationActions.confirmSimulatedQuotation();
        actions$ = m.hot('-a', { a: action });

        const updateQuotationDetailList: UpdateQuotationDetail[] = [
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            price: QUOTATION_DETAIL_MOCK.price,
            priceSource: QUOTATION_DETAIL_MOCK.priceSource,
          },
        ];

        const resultB = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });
        const resultC = QuotationKpiSimulationActions.resetSimulatedQuotation();
        const expected = m.cold('-(bc)', { b: resultB, c: resultC });

        m.expect(effects.confirmSimulatedQuotation$).toBeObservable(expected);
      })
    );

    test(
      'should filter updateQuotationDetails when price is zero',
      marbles((m) => {
        store.overrideSelector(activeCaseFeature.selectSimulatedItem, {
          ...SIMULATED_QUOTATION_MOCK,
          quotationDetails: [
            {
              ...QUOTATION_DETAIL_MOCK,
              price: 0,
              priceSource: PriceSourceOptions.GQ,
            },
            QUOTATION_DETAIL_MOCK,
          ],
        });

        action = QuotationKpiSimulationActions.confirmSimulatedQuotation();
        actions$ = m.hot('-a', { a: action });

        const updateQuotationDetailList: UpdateQuotationDetail[] = [
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            price: QUOTATION_DETAIL_MOCK.price,
            priceSource: QUOTATION_DETAIL_MOCK.priceSource,
          },
        ];

        const resultB = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });
        const resultC = QuotationKpiSimulationActions.resetSimulatedQuotation();
        const expected = m.cold('-(bc)', { b: resultB, c: resultC });

        m.expect(effects.confirmSimulatedQuotation$).toBeObservable(expected);
      })
    );

    test(
      'should updateQuotationDetails and resetSimulatedQuotation for targetPrice',
      marbles((m) => {
        store.overrideSelector(activeCaseFeature.selectSimulatedItem, {
          ...SIMULATED_QUOTATION_MOCK,
          simulatedField: ColumnFields.TARGET_PRICE,
        });

        action = QuotationKpiSimulationActions.confirmSimulatedQuotation();
        actions$ = m.hot('-a', { a: action });

        const updateQuotationDetailList: UpdateQuotationDetail[] = [
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            targetPrice: QUOTATION_DETAIL_MOCK.targetPrice,
          },
        ];

        const resultB = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });
        const resultC = QuotationKpiSimulationActions.resetSimulatedQuotation();
        const expected = m.cold('-(bc)', { b: resultB, c: resultC });

        m.expect(effects.confirmSimulatedQuotation$).toBeObservable(expected);
      })
    );

    test(
      'should filter updateQuotationDetails and resetSimulatedQuotation for targetPrice when targetPrice is zero',
      marbles((m) => {
        store.overrideSelector(activeCaseFeature.selectSimulatedItem, {
          ...SIMULATED_QUOTATION_MOCK,
          simulatedField: ColumnFields.TARGET_PRICE,
          quotationDetails: [
            {
              ...QUOTATION_DETAIL_MOCK,
              targetPrice: 0,
              priceSource: PriceSourceOptions.GQ,
            },
            QUOTATION_DETAIL_MOCK,
          ],
        });

        action = QuotationKpiSimulationActions.confirmSimulatedQuotation();
        actions$ = m.hot('-a', { a: action });

        const updateQuotationDetailList: UpdateQuotationDetail[] = [
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            targetPrice: QUOTATION_DETAIL_MOCK.targetPrice,
          },
        ];

        const resultB = ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList,
        });
        const resultC = QuotationKpiSimulationActions.resetSimulatedQuotation();
        const expected = m.cold('-(bc)', { b: resultB, c: resultC });

        m.expect(effects.confirmSimulatedQuotation$).toBeObservable(expected);
      })
    );
  });

  describe('calculateSimulatedKpisForQuotation$', () => {
    const selectedQuotationDetails = [QUOTATION_DETAIL_MOCK];
    const simulatedField = ColumnFields.PRICE_SOURCE;
    const priceSourceOption = PriceSourceOptions.GQ;
    const gqId = 123;
    const simulationData: QuotationDetailsSimulationKpiData = {
      gqId,
      simulatedField,
      priceSourceOption,
      selectedQuotationDetails,
    };

    const requestBody: QuotationSimulatedKpiRequest = {
      simulatedField,
      simulatedValue: null,
      priceSourceOption,
      detailKpiList: selectedQuotationDetails.map((detail) => ({
        gqPositionId: detail.gqPositionId,
        priceSource: detail.priceSource,
        sapPriceCondition: detail.sapPriceCondition,
        leadingSapConditionType: detail.leadingSapConditionType,
        orderQuantity: detail.orderQuantity,
        price: detail.price,
        recommendedPrice: detail.recommendedPrice,
        targetPrice: detail.targetPrice,
        strategicPrice: detail.strategicPrice,
        relocationCost: detail.relocationCost,
        sapPrice: detail.sapPrice,
        sapGrossPrice: detail.sapGrossPrice,
        lastCustomerPrice: detail.lastCustomerPrice,
        gpc: detail.gpc,
        sqv: detail.sqv,
        sapPriceUnit: detail.sapPriceUnit,
        priceUnit: detail.material.priceUnit,
      })),
    };

    test(
      'should return calculateSimulatedKPISuccess when call was success',
      marbles((m) => {
        const kpis: QuotationDetailsSimulatedKpi = {
          results: [
            {
              gqPositionId: '1234',
              priceSource: PriceSourceOptions.GQ,
              price: 20,
              simulatedKpis: null,
            } as QuotationDetailSimulatedKpi,
          ],
        };
        calculationService.createRequestForKpiSimulation = jest.fn(
          () => requestBody
        );

        calculationService.getQuotationSimulationKpiCalculations = jest.fn(() =>
          m.cold('--a|', { a: kpis })
        );

        actions$ = m.hot('-a', {
          a: QuotationKpiSimulationActions.calculateSimulatedKPI({
            simulationData,
          }),
        });

        const result =
          QuotationKpiSimulationActions.calculateSimulatedKPISuccess({
            simulatedKpis: kpis,
          });

        const expected = m.cold('---b', { b: result });

        m.expect(effects.calculateSimulatedKpisForQuotation$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          calculationService.getQuotationSimulationKpiCalculations
        ).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return calculateSimulatedKPIFailure when call was failed',
      marbles((m) => {
        const error = new Error('An error occurred');

        calculationService.createRequestForKpiSimulation = jest.fn(
          () => requestBody
        );

        calculationService.getQuotationSimulationKpiCalculations = jest.fn(() =>
          m.cold('--#|', undefined, error)
        );

        actions$ = m.hot('-a', {
          a: QuotationKpiSimulationActions.calculateSimulatedKPI({
            simulationData,
          }),
        });

        const result =
          QuotationKpiSimulationActions.calculateSimulatedKPIFailure({
            errorMessage: error as any as string,
          });

        const expected = m.cold('---b', { b: result });

        m.expect(effects.calculateSimulatedKpisForQuotation$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          calculationService.getQuotationSimulationKpiCalculations
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('calculateSimulatedSummaryKpiValues$', () => {
    const selectedQuotationDetails = [QUOTATION_DETAIL_MOCK];
    const simulatedField = ColumnFields.PRICE_SOURCE;
    const priceSourceOption = PriceSourceOptions.GQ;
    const gqId = 123;
    const simulationData: QuotationDetailsSimulationKpiData = {
      gqId,
      simulatedField,
      priceSourceOption,
      selectedQuotationDetails,
    };

    test(
      'should trigger calculateSimulatedSummaryQuotation action',
      marbles((m) => {
        store.overrideSelector(
          activeCaseFeature.selectSimulationData,
          simulationData
        );

        effects['getAffectedKpi'] = jest
          .fn()
          .mockReturnValueOnce(100)
          .mockReturnValueOnce(0.55)
          .mockReturnValueOnce(0.45)
          .mockReturnValueOnce(0.1)
          .mockReturnValueOnce(0.2)
          .mockReturnValueOnce(0.3);

        const kpis: QuotationDetailsSimulatedKpi = {
          results: [
            {
              gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
              priceSource: PriceSourceOptions.GQ,
              price: 20,
              simulatedKpis: {
                netValue: 100,
                gpi: 0.55,
                gpm: 0.45,
                discount: 0.1,
                priceDiff: 0.2,
                rlm: 0.3,
              },
            } as QuotationDetailSimulatedKpi,
          ],
        };

        const simulatedQuotationDetails: QuotationDetail[] = [
          {
            ...QUOTATION_DETAIL_MOCK,
            price: 20,
            priceSource: PriceSource.GQ,
            netValue: 100,
            gpi: 0.55,
            gpm: 0.45,
            discount: 0.1,
            priceDiff: 0.2,
            rlm: 0.3,
          },
        ];

        actions$ = m.hot('-a', {
          a: QuotationKpiSimulationActions.calculateSimulatedKPISuccess({
            simulatedKpis: kpis,
          }),
        });

        const result =
          QuotationKpiSimulationActions.calculateSimulatedSummaryQuotation({
            gqId: 123,
            simulatedQuotationDetails,
            simulatedField: ColumnFields.PRICE_SOURCE,
            selectedQuotationDetails,
          });

        const expected = m.cold('-(b)', { b: result });
        m.expect(effects.calculateSimulatedSummaryKpiValues$).toBeObservable(
          expected
        );
      })
    );

    test(
      'should trigger calculateSimulatedSummaryQuotation action for target price simulation',
      marbles((m) => {
        const simulationDataForTargetPrice = {
          ...simulationData,
          simulatedField: ColumnFields.TARGET_PRICE,
        };

        store.overrideSelector(
          activeCaseFeature.selectSimulationData,
          simulationDataForTargetPrice
        );

        effects['getAffectedKpi'] = jest.fn().mockReturnValueOnce(90.55);

        const kpis: QuotationDetailsSimulatedKpi = {
          results: [
            {
              gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
              priceSource: PriceSourceOptions.GQ,
              price: 20,
              simulatedKpis: {
                targetPrice: 90.55,
              },
            } as QuotationDetailSimulatedKpi,
          ],
        };

        const simulatedQuotationDetails: QuotationDetail[] = [
          {
            ...QUOTATION_DETAIL_MOCK,
            targetPrice: 90.55,
          },
        ];

        actions$ = m.hot('-a', {
          a: QuotationKpiSimulationActions.calculateSimulatedKPISuccess({
            simulatedKpis: kpis,
          }),
        });

        const result =
          QuotationKpiSimulationActions.calculateSimulatedSummaryQuotation({
            gqId: 123,
            simulatedQuotationDetails,
            simulatedField: ColumnFields.TARGET_PRICE,
            selectedQuotationDetails,
          });

        const expected = m.cold('-(b)', { b: result });
        m.expect(effects.calculateSimulatedSummaryKpiValues$).toBeObservable(
          expected
        );
      })
    );
  });
});
